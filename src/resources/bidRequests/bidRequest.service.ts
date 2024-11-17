"use server";

import { $Enums, Prisma, BidRequest as BidRequestRecord } from "@prisma/client";
import {
  BidRequestFormSchema,
  BidRequestSchema,
  BidRequestStatus, BidRequestT
} from "@/resources/bidRequests/bidRequest.types";
import prisma from "@/utils/prisma";
import { ListResponse, ListResponseSchema } from "@/resources/globalTypes";
import { assertAdmin, getClerkUserMap, getTokenInfo } from "@/resources/tokens/token.service";
import { UserSchema, UserTypeT } from "@/resources/users/user.types";
import { AgeLimit, TargetAge, TargetGender, WebtoonSchema } from "@/resources/webtoons/webtoon.types";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.types";
import z from "zod";
import { action } from "@/handlers/safeAction";
import { CreatorSchema } from "@/resources/creators/creator.types";

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
    status: record.status as BidRequestStatus
  };
};

const SimpleBidRequestSchema = BidRequestSchema.pick({
  id: true,
  createdAt: true,
  status: true,
  decidedAt: true,
  contractRange: true,
  message: true
}).extend({
  webtoon: WebtoonSchema.pick({
    id: true,
    title: true,
    title_en: true,
    thumbPath: true
  }),
  creator: z.object({
    user: UserSchema.pick({
      id: true,
      name: true
    })
  }),
  buyer: z.object({
    user: UserSchema.pick({
      id: true,
      name: true
    })
  })
});
export type SimpleBidRequestT = z.infer<typeof SimpleBidRequestSchema>;
export const adminListUninvoicedBidRequests = action
  .metadata({ actionName: "adminListUninvoicedBidRequests" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(SimpleBidRequestSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return _listBidRequests({
      page,
      limit: 5,
      isAdmin: true,
      uninvoicedOnly: true
    });
  });

// TODO unused?
export const adminListAllBidRequests = action
  .metadata({ actionName: "adminListAllBidRequests" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(SimpleBidRequestSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return _listBidRequests({
      page,
      limit: 10,
      isAdmin: true,
      uninvoicedOnly: false
    });
  });

export const listUninvoicedBidRequests = action
  .metadata({ actionName: "listUninvoicedBidRequests" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(SimpleBidRequestSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return _listBidRequests({
      page,
      limit: 5,
      isAdmin: false,
      uninvoicedOnly: true
    });
  });

export const listAllBidRequests = action
  .metadata({ actionName: "listAllBidRequests" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(SimpleBidRequestSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return _listBidRequests({
      page,
      limit: 10,
      isAdmin: false,
      uninvoicedOnly: false
    });
  });

async function _listBidRequests(
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
  const { userId, metadata } = await getTokenInfo();
  const { type } = metadata;

  const where: Prisma.BidRequestWhereInput = {};

  if (uninvoicedOnly) {
    where.status = $Enums.BidRequestStatus.ACCEPTED;
    where.invoice = {
      is: null
    };
  }

  if (isAdmin) {
    await assertAdmin();
  } else if (type === UserTypeT.Buyer) {
    where.userId = userId;
  } else if (type === UserTypeT.Creator) {
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
    items: records.map(r => {
      const { webtoon } = r.bidRound;
      const creatingUser = webtoon.user;
      const buyingUser = r.user;
      return {
        id: r.id,
        createdAt: r.createdAt,
        status: r.status as BidRequestStatus,
        decidedAt: r.decidedAt ?? undefined,
        contractRange: BidRequestSchema.shape.contractRange
          .safeParse(r.contractRange).data ?? [],
        message: r.message ?? undefined,
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
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

const AdminOffersBidRequestSchema = BidRequestSchema.pick({
  id: true,
  createdAt: true,
  status: true,
  contractRange: true
}).extend({
  buyer: z.object({
    user: UserSchema.pick({
      name: true
    })
  })
});
export type AdminOffersBidRequestT = z.infer<typeof AdminOffersBidRequestSchema>;
export const adminListAdminOffersBidRequests = action
  .metadata({ actionName: "adminListAdminOffersBidRequests" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .outputSchema(z.array(AdminOffersBidRequestSchema))
  .action(async ({
    bindArgsParsedInputs: [bidRoundId]
  }) => {
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
  });

const BidRequestDetailsSchema = BidRequestSchema
  .extend({
    webtoon: WebtoonSchema.extend({
      activeBidRound: z.object({
        isNew: z.boolean(),
        totalEpisodeCount: z.number().optional()
      }),
      authorOrCreatorName: z.string(),
      authorOrCreatorName_en: z.string().optional(),
      genres: z.array(
        z.object({
          id: z.number(),
          label: z.string(),
          label_en: z.string().optional()
        })
      )
    }),
    creator: CreatorSchema.pick({
      name: true,
      name_en: true,
      isAgencyAffiliated: true,
    }).extend({
      user: UserSchema.pick({
        name: true,
      }).extend({
        phone: z.string().optional(),
        email: z.string().optional(),
        thumbPath: z.string().optional()
      })
    }),
    buyer: BuyerCompanySchema.pick({
      name: true,
      dept: true,
      position: true,
    }).extend({
      user: UserSchema.pick({
        name: true,
      }).extend({
        phone: z.string().optional(),
        email: z.string().optional(),
        thumbPath: z.string().optional()
      })
    })
  });
export type BidRequestDetailsT = z.infer<typeof BidRequestDetailsSchema>;
export const getBidRequest = action
  .metadata({ actionName: "getBidRequest" })
  .bindArgsSchemas([
    z.number() //bidRequestId
  ])
  .outputSchema(BidRequestDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId]
  }) => {
    const r = await prisma.bidRequest.findUniqueOrThrow({
      where: {
        id: bidRequestId,
      },
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
      buyer: buyerDto
    };
  });

export const createBidRequest = action
  .metadata({ actionName: "createBidRequest" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .schema(BidRequestFormSchema)
  .action(async ({
    parsedInput: formData,
    bindArgsParsedInputs: [bidRoundId]
  }) => {
    const { userId } = await getTokenInfo();
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
  });

export const changeBidRequestStatus = action
  .metadata({ actionName: "changeBidRequestStatus" })
  .bindArgsSchemas([
    z.number() //bidRequestId
  ])
  .schema(z.object({
    changeTo: z.enum([BidRequestStatus.Accepted, BidRequestStatus.Declined])
  }))
  .outputSchema(BidRequestSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId],
    parsedInput: { changeTo }
  }) => {
    return prisma.$transaction(async (tx) => {
      const { status, ...record } = await tx.bidRequest.findUniqueOrThrow({
        where: {
          id: bidRequestId,
        },
        select: {
          status: true,
          bidRound: {
            select: {
              webtoon: {
                select: {
                  user: {
                    select: {
                      id: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      const { userId } = await getTokenInfo();
      if (record.bidRound.webtoon.user.id !== userId) {
        throw new Error("Only the creator of the webtoon can perform this action.");
      }
      if (status === BidRequestStatus.Declined
      || status === BidRequestStatus.Accepted) {
        throw new Error("Already approved or rejected.");
      }
      const r = await tx.bidRequest.update({
        data: {
          status: changeTo === BidRequestStatus.Accepted
            ? $Enums.BidRequestStatus.ACCEPTED
            : $Enums.BidRequestStatus.DECLINED,
        },
        where: {
          id: bidRequestId,
        }
      });
      return mapToBidRequestDTO(r);
    });
  });
