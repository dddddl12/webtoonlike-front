"use server";

import {
  BidRoundAdminSettingsSchema,
  BidRoundApprovalStatus,
  BidRoundFormSchema,
  BidRoundFormT, BidRoundSchema, StrictBidRoundAdminSettingsSchem
} from "@/resources/bidRounds/bidRound.types";
import prisma from "@/utils/prisma";
import { $Enums, Prisma } from "@prisma/client";
import { ListResponseSchema } from "@/resources/globalTypes";
import { WebtoonSchema } from "@/resources/webtoons/webtoon.types";
import z from "zod";
import { UserSchema } from "@/resources/users/user.types";
import { action } from "@/handlers/safeAction";
import { getBidRoundStatusFromRecord, mapToBidRoundDTO } from "@/resources/bidRounds/bidRound.utils";
import { assertAdmin } from "@/resources/tokens/token.service";

export const createOrUpdateBidRound = action
  .metadata({ actionName: "createOrUpdateBidRound" })
  .bindArgsSchemas([
    z.number(), // webtoonId
    z.number().optional() // bidRoundId
  ])
  .schema(BidRoundFormSchema)
  .action(async ({
    bindArgsParsedInputs: [webtoonId, bidRoundId],
    parsedInput: dataForm,
  }) => {
    if (bidRoundId !== undefined) {
      await _updateBidRound(bidRoundId, webtoonId, dataForm);
    } else {
      await _createBidRound(webtoonId, dataForm);
    }
  });

async function _createBidRound(webtoonId: number, form: BidRoundFormT) {
  await prisma.$transaction(async (tx) => {
    const existingRecord = await tx.bidRound.findFirst({
      where: {
        webtoonId,
        isActive: true,
      },
    });
    if (existingRecord) {
      // TODO 재등록 조건
      throw Error("already exists bid round for webtoonId: " + webtoonId);
    }
    await tx.bidRound.create({
      data: {
        isActive: true,
        ...form,
        webtoon: {
          connect: {
            id: webtoonId,
          }
        }
      }
    });
  });
}

async function _updateBidRound(webtoonId: number, bidRoundId: number, form: BidRoundFormT) {
  await prisma.bidRound.update({
    data: form,
    where: {
      id: bidRoundId,
      webtoonId
    }
  });
}

export const getBidRoundByWebtoonId = action
  .metadata({ actionName: "getBidRoundByWebtoonId" })
  .bindArgsSchemas([
    z.number() // webtoonId
  ])
  .action(async ({ bindArgsParsedInputs: [webtoonId] }) => {
    const record = await prisma.bidRound.findFirstOrThrow({
      where: {
        webtoonId,
        isActive: true,
      }
    });
    return mapToBidRoundDTO(record);
  });

// 관리자 기능
const AdminPageBidRoundSchema = BidRoundSchema.pick({
  id: true,
  status: true,
  createdAt: true,
}).extend({
  adminSettings: BidRoundAdminSettingsSchema,
  webtoon: WebtoonSchema.pick({
    id: true,
    title: true,
    description: true,
    thumbPath: true,
  }),
  creator: z.object({
    user: UserSchema.pick({
      name: true
    })
  })
});
export type AdminPageBidRoundT = z.infer<typeof AdminPageBidRoundSchema>;
export const adminListBidRoundsWithWebtoon = action
  .metadata({ actionName: "adminListBidRoundsWithWebtoon" })
  .schema(z.object({
    page: z.number().default(1),
    approvalStatus: z.nativeEnum(BidRoundApprovalStatus)
  }))
  .outputSchema(ListResponseSchema(AdminPageBidRoundSchema))
  .action(async ({
    parsedInput: { page, approvalStatus } }) => {
    const limit = 5;
    const where: Prisma.BidRoundWhereInput = {
      approvalStatus: approvalStatus as $Enums.BidRoundApprovalStatus,
      isActive: true,
    };
    const [records, totalRecords] = await prisma.$transaction([
      prisma.bidRound.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
        include: {
          webtoon: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbPath: true,
              user: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      }),
      prisma.bidRound.count({ where })
    ]);

    // getBidRoundStatus
    const items: AdminPageBidRoundT[] = [];
    for (const record of records) {
      const status = getBidRoundStatusFromRecord(record);
      items.push({
        id: record.id,
        createdAt: record.createdAt,
        status,
        adminSettings: {
          bidStartsAt: record.bidStartsAt ?? undefined,
          negoStartsAt: record.negoStartsAt ?? undefined,
          processEndsAt: record.processEndsAt ?? undefined,
          adminNote: record.adminNote ?? undefined,
        },
        webtoon: {
          id: record.webtoon.id,
          title: record.webtoon.title,
          description: record.webtoon.description ?? undefined,
          thumbPath: record.webtoon.thumbPath,
        },
        creator: {
          user: {
            name: record.webtoon.user.name,
          }
        }
      });
    }
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  });

const AdminPageBidRoundWithOffersSchema = BidRoundSchema
  .pick({
    id: true,
  })
  .extend({
    negoStartsAt: z.date().optional(),
    webtoon: WebtoonSchema.pick({
      id: true,
      title: true,
      title_en: true,
      thumbPath: true,
    }),
    creator: z.object({
      user: UserSchema.pick({
        name: true
      })
    }),
    offerCount: z.number(),
  });
export type AdminPageBidRoundWithOffersT = z.infer<typeof AdminPageBidRoundWithOffersSchema>;
export const adminListBidRoundsWithOffers = action
  .metadata({ actionName: "adminListBidRoundsWithOffers" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(AdminPageBidRoundWithOffersSchema))
  .action(async ({
    parsedInput: { page } }) => {
    await assertAdmin();
    const limit = 5;
    const now = new Date();
    const where: Prisma.BidRoundWhereInput = {
      approvalStatus: BidRoundApprovalStatus.Approved,
      isActive: true,
      bidRequests: {
        some: {}
      },
      negoStartsAt: {
        gt: now
      },
      bidStartsAt: {
        lte: now
      }
    };
    const [records, totalRecords] = await prisma.$transaction([
      prisma.bidRound.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
        select: {
          id: true,
          _count: {
            select: {
              bidRequests: true,
            }
          },
          negoStartsAt: true,
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
      }),
      prisma.bidRound.count({ where })
    ]);
    const items: AdminPageBidRoundWithOffersT[] = records.map(r => ({
      id: r.id,
      negoStartsAt: r.negoStartsAt ?? undefined,
      webtoon: {
        id: r.webtoon.id,
        title: r.webtoon.title,
        title_en: r.webtoon.title_en,
        thumbPath: r.webtoon.thumbPath,
      },
      creator: {
        user: {
          name: r.webtoon.user.name,
        },
      },
      offerCount: r._count.bidRequests,
    }));
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  });

export const approveOrDisapproveBidRound = action
  .metadata({ actionName: "approveOrDisapproveBidRound" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .schema(z.object({
    action: z.enum(["approve", "disapprove"]),
  }))
  .action(async ({ bindArgsParsedInputs: [bidRoundId], parsedInput: { action } }) => {
    await assertAdmin();
    switch (action) {
      case "approve":
        await _approveBidRound(bidRoundId);
        break;
      case "disapprove":
        await _disapproveBidRound(bidRoundId);
        break;
      default:
        throw Error("invalid action");
    }
  });

async function _approveBidRound(bidRoundId: number) {
  await prisma.bidRound.update({
    where: {
      id: bidRoundId
    },
    data: {
      approvalStatus: BidRoundApprovalStatus.Approved,
      approvalDecidedAt: new Date(),
    }
  });
}

// TODO 사유 포함
async function _disapproveBidRound(bidRoundId: number) {
  await prisma.bidRound.update({
    where: {
      id: bidRoundId
    },
    data: {
      approvalStatus: BidRoundApprovalStatus.Disapproved,
      approvalDecidedAt: new Date(),
    }
  });
}

export const editBidRoundAdminSettings = action
  .metadata({ actionName: "editBidRoundAdminSettings" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .schema(StrictBidRoundAdminSettingsSchem)
  .action(async ({ bindArgsParsedInputs: [bidRoundId], parsedInput: settings }) => {
    await prisma.bidRound.update({
      where: {
        id: bidRoundId
      },
      data: settings
    });
  });
