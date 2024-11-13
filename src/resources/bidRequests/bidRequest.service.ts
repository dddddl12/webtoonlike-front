"use server";

import { BidRequest as BidRequestRecord, Prisma } from "@prisma/client";
import {
  BidRequestExtendedT,
  BidRequestFormSchema,
  BidRequestFormT,
  BidRequestSchema,
  BidRequestT
} from "@/resources/bidRequests/bidRequest.types";
import prisma from "@/utils/prisma";
import { ListResponse } from "@/resources/globalTypes";
import { getClerkUserMap, getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/user.types";
import { AgeLimit, TargetAge, TargetGender, WebtoonT } from "@/resources/webtoons/webtoon.types";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.types";

const mapToBidRequestDTO = (record: BidRequestRecord): BidRequestT => {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    bidRoundId: record.bidRoundId,
    message: record.message ?? undefined,
    contractRange: BidRequestSchema.shape.contractRange
      .safeParse(record.contractRange).data ?? [],
    userId: record.userId ?? undefined,
    // status: record.approvedAt
    //   ? "오퍼 승인"
    //   : record.acceptedAt
    //     ? "오퍼 수락"
    //     : record.cancelledAt
    //       ? "오퍼 취소"
    //       : record.rejectedAt
    //         ? "오퍼 거절"
    //         : "진행 중"
  };
};


export async function listBidRequests({
  page = 1,
  limit = 10,
  excludeInvoiced = false,
  isAdmin = false,
  bidRoundId
}: {
  page?: number;
  limit?: number;
  excludeInvoiced?: boolean;
  isAdmin?: boolean;
  bidRoundId?: number;
} = {}): Promise<ListResponse<BidRequestExtendedT>> {
  const { userId, metadata } = await getTokenInfo();
  const { type } = metadata;

  const where: Prisma.BidRequestWhereInput = {
    bidRoundId,
    invoices: excludeInvoiced ? {
      none: {}
    } : undefined,
    NOT: excludeInvoiced ? {
      approvedAt: null
    } : undefined,
  //   TODO
  };
  if (!isAdmin && type === UserTypeT.Buyer) {
    where.userId = userId;
  } else if (!isAdmin && type === UserTypeT.Creator) {
    where.bidRound = {
      webtoon: {
        userId
      }
    };
  }

  const [records, totalRecords] = await prisma.$transaction([
    prisma.bidRequest.findMany({
      where,
      include: {
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
                    name: true,
                  }
                }
              }
            }
          }
        },
        user: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: limit > 0 ? limit : undefined,
      skip: (page - 1) * limit,
    }),
    prisma.bidRequest.count({ where })
  ]);
  return {
    items: records.map(record => {
      const { webtoon } = record.bidRound;
      return {
        ...mapToBidRequestDTO(record),
        webtoon: {
          id: webtoon.id,
          title: webtoon.title,
          title_en: webtoon.title_en ?? undefined,
          thumbPath: webtoon.thumbPath,
          creatorUsername: webtoon.user.name,
        },
        username: record.user.name,
        approvedAt: record.approvedAt ?? undefined,
        rejectedAt: record.rejectedAt ?? undefined,
      };
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export type BidRequestDetailsT = BidRequestT & {
  webtoon: WebtoonT & {
    activeBidRound: {
      isNew: boolean;
      totalEpisodeCount?: number;
    };
    authorOrCreatorName: string;
    authorOrCreatorName_en?: string;
    genres: {
      id: number;
      label: string;
      label_en?: string;
    }[];
  };
  creator: {
    name: string;
    name_en?: string;
    isAgencyAffiliated?: boolean;
    user: {
      name: string;
      thumbPath?: string;
      phone?: string;
      email?: string;
    };
  };
  buyer: {
    name: string;
    dept?: string;
    position?: string;
    user: {
      name: string;
      thumbPath?: string;
      phone?: string;
      email?: string;
    };
  };
};
export async function getBidRequest(bidRequestId: number, isInvoiced: boolean): Promise<BidRequestDetailsT> {
  const r = await prisma.bidRequest.findUniqueOrThrow({
    where: {
      id: bidRequestId,
    },
    include: {
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
    throw new Error("creatorUser.creator is undefined");
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
    ...mapToBidRequestDTO(r),
    webtoon: webtoonDto,
    creator: creatorDto,
    buyer: buyerDto,
  };
}


export async function createBidRequest(form: BidRequestFormT) {
  const { userId } = await getTokenInfo();
  form = BidRequestFormSchema.parse(form);
  await prisma.bidRequest.create({
    data: {
      bidRoundId: form.bidRoundId,
      message: form.message,
      contractRange: form.contractRange,
      userId,
    }
  });
}

export async function acceptBidRequest(bidRequestId: number) {
  await prisma.$transaction(async (tx) => {
    const { approvedAt, rejectedAt } = await tx.bidRequest.findUniqueOrThrow({
      where: {
        id: bidRequestId,
      },
      select: {
        approvedAt: true,
        rejectedAt: true,
      }
    });
    if (approvedAt || rejectedAt) {
      throw new Error("Already approved or rejected.");
    }
    await tx.bidRequest.update({
      data: {
        acceptedAt: new Date(),
      },
      where: {
        id: bidRequestId,
      }
    });

  });
}

export async function declineBidRequest(bidRequestId: number) {
  await prisma.$transaction(async (tx) => {
    const { approvedAt, rejectedAt } = await tx.bidRequest.findUniqueOrThrow({
      where: {
        id: bidRequestId,
      },
      select: {
        approvedAt: true,
        rejectedAt: true,
      }
    });
    if (approvedAt || rejectedAt) {
      throw new Error("Already approved or rejected.");
    }
    await tx.bidRequest.update({
      data: {
        rejectedAt: new Date(),
      },
      where: {
        id: bidRequestId,
      }
    });

  });
}

//바이어명
// 오퍼 발송일
// 현재 상태
// 희망 판권

// async function list