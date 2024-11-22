import "server-only";
import { $Enums, BidRequest as BidRequestRecord, Prisma } from "@prisma/client";
import { AdminLevel } from "@/resources/tokens/token.types";
import { UserTypeT } from "@/resources/users/user.types";
import { BadRequestError, ForbiddenError, UnexpectedServerError } from "@/handlers/errors";
import { getClerkUserMap, getTokenInfo } from "@/resources/tokens/token.service";
import { ListResponse } from "@/resources/globalTypes";
import prisma from "@/utils/prisma";
import {
  BidRequestDetailsT,
  ChangeBidRequestStatusParamsT,
  SimpleBidRequestT
} from "@/resources/bidRequests/bidRequest.controller";
import {
  BidRequestFormT,
  BidRequestSchema,
  BidRequestStatus,
  BidRequestT
} from "@/resources/bidRequests/bidRequest.types";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.types";
import { AgeLimit, TargetAge, TargetGender } from "@/resources/webtoons/webtoon.types";
import { getTranslations } from "next-intl/server";


const simpleBidRequestIncludeForQuery = {
  bidRound: {
    select: {
      webtoon: {
        select: {
          id: true,
          title: true,
          title_en: true,
          thumbPath: true,
          user: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    }
  },
  user: {
    select: {
      id: true,
      name: true,
    }
  }
};

type SimpleBidRequestQueryResult = Prisma.BidRequestGetPayload<{
  include: typeof simpleBidRequestIncludeForQuery;
}>;

export class BidRequestService {
  mapToDTO = (record: BidRequestRecord): BidRequestT => {
    return {
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      bidRoundId: record.bidRoundId,
      message: record.message ?? undefined,
      contractRange: BidRequestSchema.shape.contractRange
        .safeParse(record.contractRange).data ?? [],
      userId: record.userId ?? undefined,
      status: record.status as BidRequestStatus
    };
  };

  mapToSimpleDTO = (r: SimpleBidRequestQueryResult): SimpleBidRequestT => {
    const { webtoon } = r.bidRound;
    const creatingUser = webtoon.user;
    const buyingUser = r.user;

    return {
      ...this.mapToDTO(r),
      webtoon: {
        id: webtoon.id,
        title: webtoon.title,
        title_en: webtoon.title_en ?? undefined,
        thumbPath: webtoon.thumbPath,
      },
      creator: {
        user: {
          id: creatingUser.id,
          name: creatingUser.name
        }
      },
      buyer: {
        user: {
          id: buyingUser.id,
          name: buyingUser.name
        }
      }
    };
  };

  async whereWithReadAccess(): Promise<Prisma.BidRequestWhereInput>;
  async whereWithReadAccess(bidRequestId: number): Promise<Prisma.BidRequestWhereUniqueInput>;
  async whereWithReadAccess(bidRequestId?: number): Promise<Prisma.BidRequestWhereInput | Prisma.BidRequestWhereUniqueInput> {
    const { userId, metadata } = await getTokenInfo();
    const where: Prisma.BidRequestWhereInput | Prisma.BidRequestWhereUniqueInput = {
      // TODO 체크
      id: bidRequestId,
    };
    if (metadata.adminLevel >= AdminLevel.Admin) {
      return where;
    }
    if (metadata.type === UserTypeT.Creator) {
      where.bidRound = {
        webtoon: {
          userId
        }
      };
    } else if (metadata.type === UserTypeT.Buyer) {
      where.userId = userId;
    } else {
      throw new UnexpectedServerError();
    }
    return where;
  };

  async create(bidRoundId: number, formData: BidRequestFormT) {
    const { userId } = await getTokenInfo({
      buyer: true,
    });
    const insertData: Prisma.BidRequestCreateInput = {
      message: formData.message,
      contractRange: formData.contractRange,
      user: {
        connect: {
          id: userId
        }
      },
      bidRound: {
        connect: {
          id: bidRoundId
        }
      }
    };
    await prisma.bidRequest.create({
      data: insertData
    });
  }

  async getSimple(bidRequestId: number) {
    const where = await this.whereWithReadAccess(bidRequestId);
    const r = await prisma.bidRequest.findUniqueOrThrow({
      where,
      include: simpleBidRequestIncludeForQuery
    });
    return this.mapToSimpleDTO(r);
  }

  async getDetails(bidRequestId: number) {
    const where = await this.whereWithReadAccess(bidRequestId);
    const r = await prisma.bidRequest.findUniqueOrThrow({
      where: where,
      include: {
        // 인보이스
        invoice: {
          select: {
            id: true,
          }
        },
        // 바이어
        user: {
          select: {
            sub: true,
            name: true,
            phone: true,
            email: true,
            // TODO 전반적으로 buyer 정보가 한 컬럼에 몰려있는 건 위험이 있음
            buyer: {
              select: {
                company: true,
              }
            },
          }
        },
        bidRound: {
          select: {
          // 웹툰
            isNew: true,
            totalEpisodeCount: true,
            webtoon: {
              include: {
                genreLinks: {
                  select: {
                    genre: true
                  }
                },
                // 저작권자
                user: {
                  select: {
                    sub: true,
                    name: true,
                    phone: true,
                    email: true,
                    creator: {
                      select: {
                        name: true,
                        name_en: true,
                        isAgencyAffiliated: true,
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    const isInvoiced = !!r.invoice;
    const { user: buyerUser, bidRound } = r;
    const { webtoon } = bidRound;
    const { user: creatorUser } = webtoon;
    const clerkUserMap = await getClerkUserMap([buyerUser.sub, creatorUser.sub]);
    const buyerCompany = BuyerCompanySchema.parse(buyerUser.buyer?.company);

    // 바이어 정보 기입
    const buyerClerkUser = clerkUserMap.get(buyerUser.sub);
    const buyerDto: BidRequestDetailsT["buyer"] = {
      name: buyerCompany.name,
      dept: buyerCompany.dept,
      position: buyerCompany.position,
      user: {
        name: buyerUser.name,
        thumbPath: buyerClerkUser?.imageUrl,
        // 아래 정보는 인보이스 기발급 시에만 노출
        phone: isInvoiced ? buyerUser.phone : undefined,
        email: isInvoiced ? buyerUser.email : undefined
      }
    };

    // 저작권자 정보 기입
    if (!creatorUser.creator) {
      throw new UnexpectedServerError("creatorUser.creator is undefined");
    }
    const creatorClerkUser = clerkUserMap.get(creatorUser.sub);
    const creatorDto: BidRequestDetailsT["creator"] = {
      name: creatorUser.creator.name,
      name_en: creatorUser.creator.name_en ?? undefined,
      isAgencyAffiliated: creatorUser.creator.isAgencyAffiliated,
      user: {
        name: creatorUser.name,
        thumbPath: creatorClerkUser?.imageUrl,
        // 아래 정보는 인보이스 기발급 시에만 노출
        phone: isInvoiced ? creatorUser.phone : undefined,
        email: isInvoiced ? creatorUser.email : undefined
      }
    };

    // 웹툰 정보
    const webtoonDto: BidRequestDetailsT["webtoon"] = {
      id: webtoon.id,
      createdAt: webtoon.createdAt,
      updatedAt: webtoon.updatedAt,
      title: webtoon.title,
      title_en: webtoon.title_en,
      description: webtoon.description ?? undefined,
      description_en: webtoon.description_en ?? undefined,
      externalUrl: webtoon.externalUrl ?? undefined,
      targetAges: webtoon.targetAges
        .map(a => a as TargetAge),
      ageLimit: webtoon.ageLimit as AgeLimit,
      targetGender: webtoon.ageLimit as TargetGender,
      thumbPath: webtoon.thumbPath,
      activeBidRound: {
        isNew: bidRound.isNew,
        totalEpisodeCount: bidRound.totalEpisodeCount ?? undefined
      },
      authorOrCreatorName: webtoon.authorName ?? creatorUser.creator.name,
      authorOrCreatorName_en: webtoon.authorName_en ?? creatorUser.creator.name_en ?? undefined,
      genres: webtoon.genreLinks.map(l => ({
        id: l.genre.id,
        label: l.genre.label,
        label_en: l.genre.label_en ?? undefined,
      }))
    };

    return {
      ...this.mapToDTO(r),
      webtoon: webtoonDto,
      creator: creatorDto,
      buyer: buyerDto
    };
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
  ): Promise<ListResponse<SimpleBidRequestT>> {
    if (isAdmin) {
      await getTokenInfo({
        admin: true
      });
    }

    const where = await this.whereWithReadAccess();

    if (uninvoicedOnly) {
      where.status = $Enums.BidRequestStatus.ACCEPTED;
      where.invoice = {
        is: null
      };
    }

    const [records, totalRecords] = await prisma.$transaction([
      prisma.bidRequest.findMany({
        where,
        include: simpleBidRequestIncludeForQuery,
        orderBy: {
          createdAt: "desc"
        },
        take: limit > 0 ? limit : undefined,
        skip: (page - 1) * limit,
      }),
      prisma.bidRequest.count({ where })
    ]);
    return {
      items: records.map(this.mapToSimpleDTO),
      totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async adminListAdminOffersBidRequests(bidRoundId: number) {
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
        data: {
          status: changeTo === BidRequestStatus.Accepted
            ? $Enums.BidRequestStatus.ACCEPTED
            : $Enums.BidRequestStatus.DECLINED,
        },
        where: {
          id: bidRequestId,
        },
        include: simpleBidRequestIncludeForQuery
      });
      return this.mapToSimpleDTO(r);
    });
  }
}

const bidRequestService = new BidRequestService();
export default bidRequestService;