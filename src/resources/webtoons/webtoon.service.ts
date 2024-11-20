"use server";

import { Prisma, $Enums } from "@prisma/client";
import {
  AgeLimit,
  TargetAge, TargetGender, WebtoonFormSchema, WebtoonFormT, WebtoonSchema
} from "@/resources/webtoons/webtoon.types";
import { BidRoundApprovalStatus, BidRoundSchema, BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { UserTypeT } from "@/resources/users/user.types";
import { ListResponseSchema } from "@/resources/globalTypes";
import { assertCreator, getTokenInfo } from "@/resources/tokens/token.service";
import { AdminLevel } from "@/resources/tokens/token.types";
import prisma from "@/utils/prisma";
import { getBidRoundStatusFromRecord, mapToBidRoundDTO, offerableBidRoundFilter } from "@/resources/bidRounds/bidRound.utils";
import z from "zod";
import { action } from "@/handlers/safeAction";
import { UnexpectedError } from "@/handlers/errors";

// TODO 권한, 사용자 타입, 관리자 체크
export const createOrUpdateWebtoon = action
  .schema(WebtoonFormSchema)
  .metadata({ actionName: "createOrUpdateWebtoon" })
  .bindArgsSchemas([
    z.number().optional() // webtoonId
  ])
  .action(async ({
    parsedInput: formData,
    bindArgsParsedInputs: [webtoonId]
  }) => {
    if (webtoonId){
      await updateWebtoon(webtoonId, formData);
    } else {
      await createWebtoon(formData);
    }
  });

async function createWebtoon(form: WebtoonFormT) {
  const { genreIds, ...rest } = form;
  const { userId } = await getTokenInfo();
  const insertData: Prisma.WebtoonCreateInput = {
    ...rest,
    user: {
      connect: {
        id: userId
      }
    }
  };
  await prisma.$transaction(async (tx) => {
    const result = await tx.webtoon.create({
      data: insertData,
      select: {
        id: true
      }
    });
    await tx.xWebtoonGenre.createMany({
      data: genreIds.map(id => ({
        webtoonId: result.id,
        genreId: id
      }))
    });
  });
}

async function updateWebtoon(webtoonId: number, form: WebtoonFormT) {
  const { genreIds, ...rest } = form;
  const insertData: Prisma.WebtoonUpdateInput = rest;

  await prisma.$transaction(async (tx) => {
    const { genreLinks } = await tx.webtoon.update({
      data: insertData,
      where: { id: webtoonId },
      select: {
        genreLinks: true
      }
    });

    // 새로 선택된 장르 선택
    const genreIdsToAdd = genreIds.filter(id => !genreLinks.some(l => l.genreId === id));
    if (genreIdsToAdd.length > 0) {
      await tx.xWebtoonGenre.createMany({
        data: genreIdsToAdd.map(id => ({
          webtoonId,
          genreId: id
        }))
      });
    }

    // 더 이상 사용하지 않는 장르 삭제
    await tx.xWebtoonGenre.deleteMany({
      where: {
        webtoonId,
        genreId: {
          notIn: form.genreIds
        }
      }
    });
  });
}

// 그리드에 표시하기 위한 기본폼
const WebtoonPreviewSchema = WebtoonSchema.pick({
  id: true,
  title: true,
  title_en: true,
  description: true,
  description_en: true,
  thumbPath: true,
});
export type WebtoonPreviewT = z.infer<typeof WebtoonPreviewSchema>;
const mapToWebtoonPreviewDTO = (record: {
  id: number;
  title: string;
  title_en: string;
  description: string | null;
  description_en: string | null;
  thumbPath: string;
}): WebtoonPreviewT => ({
  id: record.id,
  title: record.title,
  title_en: record.title_en,
  description: record.description ?? undefined,
  description_en: record.description_en ?? undefined,
  thumbPath: record.thumbPath,
});

// 바이어용
// /webtoons
// /creators/[userId]
const WebtoonFilterSchema = z.object({
  genreIds: z.array(z.number()).default([]),
  ageLimits: z.array(z.nativeEnum(AgeLimit)).default([]),
  page: z.number().default(1)
});
export type WebtoonFilterT = z.infer<typeof WebtoonFilterSchema>;
export const listWebtoons = action
  .metadata({ actionName: "listWebtoons" })
  .schema(WebtoonFilterSchema)
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({ parsedInput: formData }) => {
    return _listWebtoons(formData);
  });

export const listWebtoonsByUserId = action
  .metadata({ actionName: "listWebtoonsByUserId" })
  .schema(z.object({
    userId: z.number(),
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({ parsedInput: formData }) => {
    return _listWebtoons(formData);
  });

export const _listWebtoons = async ({ genreIds, userId, ageLimits, page }: {
  genreIds?: number[];
  userId?: number;
  ageLimits?: AgeLimit[];
  page: number;
}) => {
  const limit = 10;
  const where: Prisma.WebtoonWhereInput = {
    bidRounds: {
      some: offerableBidRoundFilter()
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
      where,
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        title: true,
        title_en: true,
        description: true,
        description_en: true,
        thumbPath: true,
      }
    }),
    prisma.webtoon.count({ where })
  ]);
  return {
    items: records.map(mapToWebtoonPreviewDTO),
    totalPages: Math.ceil(totalRecords / limit),
  };
};

// 바이어용
// /account
export const listLikedWebtoons = action
  .metadata({ actionName: "listLikedWebtoons" })
  .schema(z.object({
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({ parsedInput: { page } }) => {
    const limit = 10;
    const { userId } = await getTokenInfo();
    const where: Prisma.WebtoonLikeWhereInput = {
      userId
    };

    // TODO 오퍼 가능 기간이 끝나면?

    const [records, totalRecords] = await prisma.$transaction([
      prisma.webtoonLike.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        select: {
          webtoon: {
            select: {
              id: true,
              title: true,
              title_en: true,
              description: true,
              description_en: true,
              thumbPath: true,
            }
          }
        }
      }),
      prisma.webtoonLike.count({ where })
    ]);
    return {
      items: records.map(record => {
        return mapToWebtoonPreviewDTO(record.webtoon);
      }),
      totalPages: Math.ceil(totalRecords / limit),
    };
  });

// 저작권자용
// /webtoons (미등록 작품)
const MyWebtoonNotOnSaleSchema = WebtoonPreviewSchema.extend({
  createdAt: z.date(),
  bidRoundApprovalStatus: z.nativeEnum(BidRoundApprovalStatus).optional(),
  episodeCount: z.number()
});
export type MyWebtoonNotOnSaleT = z.infer<typeof MyWebtoonNotOnSaleSchema>;
export const listMyWebtoonsNotOnSale = action
  .metadata({ actionName: "listMyWebtoonsNotOnSale" })
  .schema(z.object({
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(MyWebtoonNotOnSaleSchema))
  .action(async ({ parsedInput: { page } }) => {
    await assertCreator();
    const { userId } = await getTokenInfo();

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
    return {
      items: records.map(record => {
        const activeBidRound = record.bidRounds?.[0];
        const bidRoundApprovalStatus = activeBidRound
          ? activeBidRound.approvalStatus as BidRoundApprovalStatus
          : undefined;
        return {
          ...mapToWebtoonPreviewDTO(record),
          createdAt: record.createdAt,
          bidRoundApprovalStatus,
          episodeCount: record._count.episodes ?? 0
        };
      }),
      totalPages: Math.ceil(totalRecords / limit),
    };
  });

// 저작권자용
// /webtoons (판매 등록 작품)
const MyWebtoonOnSaleSchema = WebtoonPreviewSchema.extend({
  bidRoundApprovedAt: z.date(),
  bidRoundStatus: z.nativeEnum(BidRoundStatus)
});
export type MyWebtoonOnSaleT = z.infer<typeof MyWebtoonOnSaleSchema>;
export const listMyWebtoonsOnSale = action
  .metadata({ actionName: "listMyWebtoonsOnSale" })
  .schema(z.object({
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(MyWebtoonOnSaleSchema))
  .action(async ({ parsedInput: { page } }) => {
    await assertCreator();
    const { userId } = await getTokenInfo();

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
    for (const record of records) {
    // TODO 등록일은 승인일 기준?
      const bidRoundRecord = record.bidRounds[0];
      const bidRoundStatus = getBidRoundStatusFromRecord(bidRoundRecord);
      if (!bidRoundRecord.approvalDecidedAt) {
        continue;
      }
      items.push({
        ...mapToWebtoonPreviewDTO(record),
        bidRoundApprovedAt: bidRoundRecord.approvalDecidedAt,
        bidRoundStatus
      });
    }
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  });

// /webtoon/[webtoonId]
// /webtoon/create
// /webtoon/[webtoonId]/update // todo 기본 정보용 엔드포인트 따로 생성
const WebtoonDetailsSchema = WebtoonSchema
  .extend({
    // From joined tables
    isEditable: z.boolean(),
    hasRightToOffer: z.boolean(),
    authorOrCreatorName: z.string(),
    // todo 서버에서 언어 판단 미리 할 것
    authorOrCreatorName_en: z.string().optional(),
    likeCount: z.number(),
    myLike: z.boolean(),
    genres: z.array(z.object({
      id: z.number(),
      label: z.string(),
      label_en: z.string().optional(),
    })),
    activeBidRound: BidRoundSchema.optional(),
    firstEpisodeId: z.number().optional()
  });
export type WebtoonDetailsT = z.infer<typeof WebtoonDetailsSchema>;
export const getWebtoon = action
  .metadata({ actionName: "getWebtoon" })
  .bindArgsSchemas([
    z.number() // webtoonId
  ])
  .outputSchema(WebtoonDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [webtoonId]
  }) => {
    const { userId, metadata } = await getTokenInfo();
    const where: Prisma.WebtoonWhereUniqueInput = {
      id: webtoonId
    };
    // 권한에 따른 조건 제한
    if (metadata.adminLevel < AdminLevel.Admin) {
      if (metadata.type === UserTypeT.Creator) {
        // 저작권자는 자기 자신의 웹툰만 조회 가능
        where.userId = userId;
      } else {
        // 바이어는 공개된 작품만 조회 가능
        where.bidRounds = {
          some: offerableBidRoundFilter()
        };
      }
    }

    // 조회
    const record = await prisma.webtoon.findUniqueOrThrow({
      where,
      include: {
        user: {
          select: {
            creator: {
              select: {
                id: true,
                name: true,
                name_en: true,
              }
            }
          }
        },
        episodes: {
          select: {
            id: true,
          },
          orderBy: {
            episodeNo: "asc",
          },
          take: 1
        },
        bidRounds: {
          where: {
            isActive: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        },
        likes: {
          where: {
            userId
          },
          take: 1
        },
        genreLinks: {
          select: {
            genre: {
              select: {
                id: true,
                label: true,
                label_en: true
              }
            }
          },
          orderBy: {
            genre: {
              rank: "asc"
            }
          }
        }
      }
    });
    const { creator } = record.user;
    if (!creator) {
    // TODO http 에러로 대체
      throw new UnexpectedError("Creator should exist.");
    }
    const bidRoundRecord = record.bidRounds?.[0];
    const bidRound = bidRoundRecord
      ? mapToBidRoundDTO(bidRoundRecord)
      : undefined;
    return {
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      title: record.title,
      title_en: record.title_en,
      description: record.description ?? undefined,
      description_en: record.description_en ?? undefined,
      externalUrl: record.externalUrl ?? undefined,
      targetAges: record.targetAges
        .map(a => a as TargetAge),
      ageLimit: record.ageLimit as AgeLimit,
      // TODO 이것이 표시가 되던가?
      targetGender: record.targetGender as TargetGender,
      thumbPath: record.thumbPath,
      isEditable: metadata.type === UserTypeT.Creator
      && (record.userId === userId || metadata.adminLevel >= AdminLevel.Admin),
      hasRightToOffer: metadata.type === UserTypeT.Buyer,
      authorOrCreatorName: record.authorName ?? creator?.name,
      authorOrCreatorName_en: record.authorName_en ?? creator?.name_en ?? undefined,
      likeCount: record._count.likes,
      myLike: record.likes.length > 0,
      genres: record.genreLinks
        .map(l=> ({
          id: l.genre.id,
          label: l.genre.label,
          label_en: l.genre.label_en ?? undefined,
        })),
      activeBidRound: bidRound,
      firstEpisodeId: record.episodes?.[0]?.id,
    };
  });
