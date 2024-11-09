"use server";

import {
  BidRoundFormSchema,
  BidRoundFormT, BidRoundStatus, BidRoundT, ContractRange,
} from "@/resources/bidRounds/bidRound.types";
import { $Enums } from "@prisma/client";
import prisma from "@/utils/prisma";

export async function updateBidRound(form: BidRoundFormT) {
  form = BidRoundFormSchema.parse(form);
  const data = {
    webtoonId: form.webtoonId,
    contractRange: form.contractRange,
    isOriginal: form.isOriginal,
    isNew: form.isNew,
    totalEpisodeCount: form.totalEpisodeCount,
    currentEpisodeNo: form.currentEpisodeNo,
    monthlyEpisodeCount: form.monthlyEpisodeCount,
    status: "IDLE" as $Enums.BidRoundStatus
  };
  await prisma.bidRound.upsert({
    create: data,
    update: data,
    where: {
      webtoonId: form.webtoonId
    }
  });
}

export async function getBidRound(webtoonId: number): Promise<BidRoundT> {
  const record = await prisma.bidRound.findUniqueOrThrow({
    where: {
      webtoonId
    }
  });
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    webtoonId: record.webtoonId,
    contractRange: ContractRange.parse(record.contractRange),
    isOriginal: record.isOriginal,
    isNew: record.isNew,
    currentEpisodeNo: record.currentEpisodeNo ?? undefined,
    totalEpisodeCount: record.totalEpisodeCount ?? undefined,
    monthlyEpisodeCount: record.monthlyEpisodeCount ?? undefined,
    status: record.status as BidRoundStatus
  };
}