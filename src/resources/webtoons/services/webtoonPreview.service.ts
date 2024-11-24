import "server-only";
import { AgeLimit } from "@/resources/webtoons/dtos/webtoon.dto";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { $Enums, Prisma } from "@prisma/client";
import prisma from "@/utils/prisma";
import { getLocale } from "next-intl/server";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import webtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";
import { ListResponse } from "@/resources/globalTypes";
import { MyWebtoonNotOnSaleT, MyWebtoonOnSaleT, WebtoonPreviewT } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import bidRoundHelper from "@/resources/bidRounds/helpers/bidRound.helper";

class WebtoonPreviewService {
  async list({ genreIds, userId, ageLimits, page }: {
    genreIds?: number[];
    userId?: number;
    ageLimits?: AgeLimit[];
    page: number;
  }): Promise<ListResponse<WebtoonPreviewT>> {
    // 바이어 전용
    await getTokenInfo({
      buyer: true,
      admin: true
    });
    const limit = 10;
    const where: Prisma.WebtoonWhereInput = {
      bidRounds: {
        some: bidRoundHelper.offerableBidRoundWhere()
      },
      userId
    };

    // Age limit 필터
    if (ageLimits && ageLimits.length > 0) {
      where.ageLimit = {
        in: ageLimits
      };
    }

    // Genre 필터
    if (genreIds && genreIds.length > 0) {
      where.genreLinks = {
        some: {
          genreId: {
            in: genreIds
          }
        }
      };
    }

    const [records, totalRecords] = await prisma.$transaction([
      prisma.webtoon.findMany({
        ...webtoonPreviewHelper.query,
        where,
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.webtoon.count({ where })
    ]);
    const locale = await getLocale();
    return {
      items: records.map(r =>
        webtoonPreviewHelper.mapToDTO(r, locale)),
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  async listLikedWebtoons({ page }: {
    page: number;
  }): Promise<ListResponse<WebtoonPreviewT>> {
    // 바이어용
    const { userId } = await getTokenInfo({
      buyer: true,
    });
    const where: Prisma.WebtoonLikeWhereInput = {
      userId
    };

    // TODO 오퍼 가능 기간이 끝나면?

    const limit = 10;
    const [records, totalRecords] = await prisma.$transaction([
      prisma.webtoonLike.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        select: {
          webtoon: webtoonPreviewHelper.query
        }
      }),
      prisma.webtoonLike.count({ where })
    ]);
    const locale = await getLocale();
    return {
      items: records.map(r => {
        return webtoonPreviewHelper.mapToDTO(r.webtoon, locale);
      }),
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  async listMyWebtoonsNotOnSale({ page }: {
    page: number;
  }): Promise<ListResponse<MyWebtoonNotOnSaleT>>{
    // 저작권자용
    const { userId } = await getTokenInfo({
      creator: true,
    });

    const where: Prisma.WebtoonWhereInput = {
      userId,
      bidRounds: {
        none: {
          isActive: true,
          approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED
        }
      }
    };
    const limit = 5;

    const [records, totalRecords] = await prisma.$transaction([
      prisma.webtoon.findMany({
        where,
        include: {
          bidRounds: {
            select: {
              approvalStatus: true
            },
            where: {
              isActive: true,
            }
          },
          _count: {
            select: {
              episodes: true
            }
          }
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.webtoon.count({ where })
    ]);
    const locale = await getLocale();
    return {
      items: records.map(record => {
        const activeBidRound = record.bidRounds?.[0];
        const bidRoundApprovalStatus = activeBidRound
          ? activeBidRound.approvalStatus as BidRoundApprovalStatus
          : undefined;
        return {
          ...webtoonPreviewHelper.mapToDTO(record, locale),
          createdAt: record.createdAt,
          bidRoundApprovalStatus,
          episodeCount: record._count.episodes ?? 0
        };
      }),
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  async listMyWebtoonsOnSale({ page }: {
    page: number;
  }): Promise<ListResponse<MyWebtoonOnSaleT>>{
    // 저작권자용
    const { userId } = await getTokenInfo({
      creator: true,
    });

    const where: Prisma.WebtoonWhereInput = {
      userId,
      bidRounds: {
        some: {
          isActive: true,
          approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED
        }
      }
    };
    const limit = 5;

    const [records, totalRecords] = await prisma.$transaction([
      prisma.webtoon.findMany({
        where,
        include: {
          bidRounds: {
            select: {
              approvalDecidedAt: true,
              bidStartsAt: true,
              negoStartsAt: true,
              processEndsAt: true,
              approvalStatus: true,
            },
            where: {
              isActive: true,
            }
          }
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.webtoon.count({ where })
    ]);
    const items: MyWebtoonOnSaleT[] = [];
    const locale = await getLocale();
    for (const record of records) {
      const bidRoundRecord = record.bidRounds[0];
      const bidRoundStatus = bidRoundHelper.getStatusFromRecord(bidRoundRecord);
      if (!bidRoundRecord.approvalDecidedAt) {
        continue;
      }
      items.push({
        ...webtoonPreviewHelper.mapToDTO(record, locale),
        bidRoundApprovedAt: bidRoundRecord.approvalDecidedAt,
        bidRoundStatus
      });
    }
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  };
}

const webtoonPreviewService = new WebtoonPreviewService();
export default webtoonPreviewService;
