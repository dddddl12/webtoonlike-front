"use server";

import { $Enums, Prisma } from "@prisma/client";
import {
  BidRequestFormSchema,
  BidRequestSchema,
  BidRequestStatus
} from "@/resources/bidRequests/bidRequest.types";
import prisma from "@/utils/prisma";
import { ListResponseSchema } from "@/resources/globalTypes";
import { getClerkUserMap, getTokenInfo } from "@/resources/tokens/token.controller";
import { UserSchema, UserTypeT } from "@/resources/users/user.types";
import { AgeLimit, TargetAge, TargetGender, WebtoonSchema } from "@/resources/webtoons/webtoon.types";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.types";
import z from "zod";
import { action } from "@/handlers/safeAction";
import { CreatorSchema } from "@/resources/creators/creator.types";
import { BadRequestError, ForbiddenError, UnexpectedServerError } from "@/handlers/errors";
import { getTranslations } from "next-intl/server";
import {
  getBidRequestWhereUniqueInputWithPermissionCheck, listBidRequests, mapToBidRequestDTO, mapToSimpleBidRequestDTO,
  simpleBidRequestIncludeForQuery
} from "@/resources/bidRequests/bidRequest.service";

const SimpleBidRequestSchema = BidRequestSchema.extend({
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
    return listBidRequests({
      page,
      limit: 5,
      isAdmin: true,
      uninvoicedOnly: true
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
    return listBidRequests({
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
    return listBidRequests({
      page,
      limit: 10,
      isAdmin: false,
      uninvoicedOnly: false
    });
  });

export const getSimpleBidRequest = action
  .metadata({ actionName: "getSimpleBidRequest" })
  .bindArgsSchemas([
    z.number() // bidRequestId
  ])
  .outputSchema(SimpleBidRequestSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId]
  }) => {
    const where = await getBidRequestWhereUniqueInputWithPermissionCheck(bidRequestId);
    const r = await prisma.bidRequest.findUniqueOrThrow({
      where,
      include: simpleBidRequestIncludeForQuery
    });
    return mapToSimpleBidRequestDTO(r);
  });

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
    const where = await getBidRequestWhereUniqueInputWithPermissionCheck(bidRequestId);
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

// /offers 오퍼 승인 또는 취소
export const changeBidRequestStatus = action
  .metadata({ actionName: "changeBidRequestStatus" })
  .bindArgsSchemas([
    z.number(), //bidRequestId
  ])
  .schema(z.object({
    changeTo: z.enum([BidRequestStatus.Accepted, BidRequestStatus.Declined]),
    refMessageId: z.number().optional()
  }))
  .outputSchema(SimpleBidRequestSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId],
    parsedInput: { changeTo, refMessageId }
  }) => {
    const t = await getTranslations("errors.serverActions.changeBidRequestStatus");
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
      return mapToSimpleBidRequestDTO(r);
    });
  });
