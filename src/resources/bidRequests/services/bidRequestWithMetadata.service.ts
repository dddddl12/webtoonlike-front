import "server-only";
import prisma from "@/utils/prisma";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { $Enums } from "@prisma/client";
import {
  AdminOffersBidRequestT,
  BidRequestSchema,
  BidRequestStatus,
} from "@/resources/bidRequests/dtos/bidRequest.dto";
import { getLocale, getTranslations } from "next-intl/server";
import { BadRequestError, ForbiddenError } from "@/handlers/errors";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import bidRequestHelper from "@/resources/bidRequests/helpers/bidRequest.helper";
import bidRequestWithMetadataHelper from "@/resources/bidRequests/helpers/bidRequestWithMetadata.helper";
import { BidRequestWithMetaDataT } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";
import { ChangeBidRequestStatusParamsT } from "@/resources/bidRequests/controllers/bidRequestWithMetadata.controller";

class BidRequestWithMetadataService {
  async get(bidRequestId: number): Promise<BidRequestWithMetaDataT> {
    const where = await bidRequestHelper.whereWithReadAccess(bidRequestId);
    const r = await prisma.bidRequest.findUniqueOrThrow({
      ...bidRequestWithMetadataHelper.query,
      where,
    });
    const locale = await getLocale();
    return bidRequestWithMetadataHelper.mapToDTO(r, locale);
  }

  async list(
    {
      page,
      limit,
      isAdmin,
      uninvoicedOnly,
    }: {
      page: number;
      limit: number;
      isAdmin: boolean;
      uninvoicedOnly: boolean;
    }
  ): Promise<ListResponse<BidRequestWithMetaDataT>> {
    if (isAdmin) {
      await getTokenInfo({
        admin: true
      });
    }

    const where = await bidRequestHelper.whereWithReadAccess();

    if (uninvoicedOnly) {
      where.status = $Enums.BidRequestStatus.ACCEPTED;
      where.invoice = {
        is: null
      };
    }

    const [records, totalRecords] = await prisma.$transaction([
      prisma.bidRequest.findMany({
        ...bidRequestWithMetadataHelper.query,
        where,
        orderBy: {
          createdAt: "desc"
        },
        take: limit > 0 ? limit : undefined,
        skip: (page - 1) * limit,
      }),
      prisma.bidRequest.count({ where })
    ]);
    const locale = await getLocale();
    return {
      items: records.map(r => bidRequestWithMetadataHelper.mapToDTO(r, locale)),
      totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async adminListAdminOffersBidRequests(bidRoundId: number): Promise<AdminOffersBidRequestT[]> {
    await getTokenInfo({
      admin: true
    });
    const records = await prisma.bidRequest.findMany({
      where: {
        bidRoundId
      },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return records.map(r => ({
      id: r.id,
      createdAt: r.createdAt,
      status: r.status as BidRequestStatus,
      contractRange: BidRequestSchema.shape.contractRange
        .safeParse(r.contractRange).data ?? [],
      buyer: {
        user: {
          name: r.user.name,
        }
      }
    }));
  }

  async changeStatus(
    bidRequestId: number,
    { changeTo, refMessageId }: ChangeBidRequestStatusParamsT
  ) {
    await getTokenInfo({
      admin: true
    });
    return prisma.$transaction(async (tx) => {
      const { status, ...record } = await tx.bidRequest.findUniqueOrThrow({
        where: {
          id: bidRequestId,
        },
        select: {
          status: true,
          userId: true,
          bidRound: {
            select: {
              webtoon: {
                select: {
                  userId: true
                }
              }
            }
          },
          messages: {
            select: {
              id: true,
              user: {
                select: {
                  userType: true
                }
              }
            },
            take: 1,
            orderBy: {
              createdAt: "desc"
            }
          },
        }
      });
      const { userId, metadata } = await getTokenInfo();
      const t = await getTranslations("errors.serverActions.changeBidRequestStatus");
      if (status === BidRequestStatus.Accepted) {
        throw new BadRequestError({
          title: t("title"),
          message: t("alreadyAccepted")
        });
      }
      if (status === BidRequestStatus.Declined) {
        throw new BadRequestError({
          title: t("title"),
          message: t("alreadyRejected")
        });
      }
      const latestMessageId = record.messages?.[0]?.id;
      if (latestMessageId !== refMessageId) {
        // 둘 다 undefined인 경우에도 허용되는데, 이는 최초 bid request를 보고 바로 결정하는 경우
        throw new BadRequestError({
          title: t("title"),
          message: t("outdated")
        });
      }
      if (!record.messages
        && (metadata.type !== UserTypeT.Creator
        || record.bidRound.webtoon.userId !== userId)
      ){
        // 주고받은 메시지가 없으면 최초에는 저작권자가 수락/거절 가능
        throw new ForbiddenError({
          title: t("title"),
          message: t("abnormalAccess"),
          logError: true
        });
      }
      if (record.messages?.[0]?.user.userType === metadata.type
        || ![record.userId, record.bidRound.webtoon.userId].includes(userId)
      ) {
        // 메시지를 주고받는 경우에는 마지막 메시지를 수신한 측에서만 수락/거절 가능
        throw new ForbiddenError({
          title: t("title"),
          message: t("abnormalAccess"),
          logError: true
        });
      }

      const r = await tx.bidRequest.update({
        ...bidRequestWithMetadataHelper.query,
        data: {
          status: changeTo === BidRequestStatus.Accepted
            ? $Enums.BidRequestStatus.ACCEPTED
            : $Enums.BidRequestStatus.DECLINED,
        },
        where: {
          id: bidRequestId,
        },
      });
      const locale = await getLocale();
      return bidRequestWithMetadataHelper.mapToDTO(r, locale);
    });
  }
}

const bidRequestWithMetadataService = new BidRequestWithMetadataService();
export default bidRequestWithMetadataService;
