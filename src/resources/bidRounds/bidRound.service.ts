"use server";

import {
  BidRoundApprovalStatus,
  BidRoundFormSchema,
  BidRoundFormT, BidRoundStatus, BidRoundT, ContractRange,
} from "@/resources/bidRounds/bidRound.types";
import prisma from "@/utils/prisma";
import { $Enums, BidRound as BidRoundRecord, Prisma } from "@prisma/client";

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
  } else if (approvalStatus === BidRoundApprovalStatus.Rejected) {
    return BidRoundStatus.Rejected;
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


export async function getBidRound(webtoonId: number): Promise<BidRoundT> {
  const record = await prisma.bidRound.findFirstOrThrow({
    where: {
      webtoonId,
      isActive: true,
    }
  });
  return mapToBidRoundDTO(record);
}