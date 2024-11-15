"use server";

import {
  BidRoundAdminSettingsSchema,
  BidRoundApprovalStatus,
  BidRoundFormSchema,
  BidRoundFormT, BidRoundSchema, BidRoundStatus, BidRoundT, ContractRange,
} from "@/resources/bidRounds/bidRound.types";
import prisma from "@/utils/prisma";
import { $Enums, BidRound as BidRoundRecord, Prisma } from "@prisma/client";
import { ListResponse } from "@/resources/globalTypes";
import { WebtoonSchema } from "@/resources/webtoons/webtoon.types";
import z from "zod";
import { UserSchema } from "@/resources/users/user.types";

const convertToRecordInput = (form: BidRoundFormT): Prisma.BidRoundUncheckedCreateInput => {
  form = BidRoundFormSchema.parse(form);
  return {
    webtoonId: form.webtoonId,
    isActive: true,
    contractRange: form.contractRange,
    isOriginal: form.isOriginal,
    isNew: form.isNew,
    totalEpisodeCount: form.totalEpisodeCount,
    currentEpisodeNo: form.currentEpisodeNo,
    monthlyEpisodeCount: form.monthlyEpisodeCount,
  };
};

export async function createBidRound(form: BidRoundFormT) {
  form = BidRoundFormSchema.parse(form);

  await prisma.$transaction(async (tx) => {
    const existingRecord = await tx.bidRound.findFirst({
      where: {
        webtoonId: form.webtoonId,
        isActive: true,
      },
    });
    if (existingRecord) {
      // TODO 재등록 조건
      throw Error("already exists bid round for webtoonId: " + form.webtoonId);
    }
    await tx.bidRound.create({
      data: convertToRecordInput(form)
    });
  });
}

export async function updateBidRound(bidRoundId: number, form: BidRoundFormT) {
  form = BidRoundFormSchema.parse(form);
  await prisma.bidRound.update({
    data: {
      ...convertToRecordInput(form),
      id: bidRoundId
    },
    where: {
      id: bidRoundId
    }
  });
}

export const getBidRoundStatus = async (record: {
  bidStartsAt: Date | null;
  negoStartsAt: Date | null;
  processEndsAt: Date | null;
  approvalStatus: $Enums.BidRoundApprovalStatus;
}): Promise<BidRoundStatus> => {
  const now = new Date();
  const { bidStartsAt, negoStartsAt, processEndsAt } = record;
  const approvalStatus = record.approvalStatus as BidRoundApprovalStatus;
  if (approvalStatus === BidRoundApprovalStatus.Pending) {
    return BidRoundStatus.PendingApproval;
  } else if (approvalStatus === BidRoundApprovalStatus.Disapproved) {
    return BidRoundStatus.Disapproved;
  } else if (!bidStartsAt || bidStartsAt > now) {
    return BidRoundStatus.Waiting;
  } else if (!negoStartsAt || negoStartsAt > now) {
    return BidRoundStatus.Bidding;
  } else if (!processEndsAt || processEndsAt > now) {
    return BidRoundStatus.Negotiating;
  } else {
    return BidRoundStatus.Done;
  }
};
export const mapToBidRoundDTO = async (record: BidRoundRecord): Promise<BidRoundT> => {
  const status = await getBidRoundStatus(record);
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    webtoonId: record.webtoonId,
    contractRange: ContractRange.safeParse(record.contractRange).data ?? [],
    isOriginal: record.isOriginal,
    isNew: record.isNew,
    totalEpisodeCount: record.totalEpisodeCount ?? undefined,
    currentEpisodeNo: record.currentEpisodeNo ?? undefined,
    monthlyEpisodeCount: record.monthlyEpisodeCount ?? undefined,
    status,
  };
};


export async function getBidRoundByWebtoonId(webtoonId: number): Promise<BidRoundT> {
  const record = await prisma.bidRound.findFirstOrThrow({
    where: {
      webtoonId,
      isActive: true,
    }
  });
  return mapToBidRoundDTO(record);
}

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
export async function listBidRoundsWithWebtoon({ page, approvalStatus }: {
  page: number;
  approvalStatus: BidRoundApprovalStatus;
}): Promise<ListResponse<AdminPageBidRoundT>> {
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
    const status = await getBidRoundStatus(record);
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
}

export type AdminPageBidRoundWithOffersT = {
  bidRoundId: number;
  webtoon: {
    id: number;
    title: string;
    title_en?: string;
    thumbPath: string;
  };
  // todo 혼동을 피하기 위해 유저는 모두 username이라고 쓸 것
  creatorUser: {
    username: string;
  };
  offerCount: number;
  negoStartsAt?: Date;
};
export async function listBidRoundsWithOffers({ page }: {
  page: number;
}): Promise<ListResponse<AdminPageBidRoundWithOffersT>> {
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
  const items = records.map(r => ({
    bidRoundId: r.id,
    webtoon: {
      id: r.webtoon.id,
      title: r.webtoon.title,
      title_en: r.webtoon.title_en,
      thumbPath: r.webtoon.thumbPath,
    },
    creatorUser: {
      username: r.webtoon.user.name,
    },
    offerCount: r._count.bidRequests,
    negoStartsAt: r.negoStartsAt ?? undefined,
  }));
  return {
    items,
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function approveBidRound(bidRoundId: number) {
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
export async function declineBidRound(bidRoundId: number) {
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

export type BidRoundAdminSettingsT = z.infer<typeof BidRoundAdminSettingsSchema>;
export async function editBidRoundAdminSettings(bidRoundId: number, settings: BidRoundAdminSettingsT) {
  await prisma.bidRound.update({
    where: {
      id: bidRoundId
    },
    data: settings
  });
}

