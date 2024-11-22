import "server-only";
import { $Enums, BidRound as BidRoundRecord, Prisma } from "@prisma/client";
import { BidRoundApprovalStatus, BidRoundStatus, BidRoundT, ContractRange } from "@/resources/bidRounds/bidRound.types";
import { getBidRoundStatus } from "@/resources/bidRounds/bidRoundStatus";

export const offerableBidRoundFilter = (): Prisma.BidRoundWhereInput => {
  const now = new Date();
  return {
    isActive: true,
    approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED,
    bidStartsAt: {
      lte: now
    }
  };
};

export const getBidRoundStatusFromRecord = (record: {
  bidStartsAt: Date | null;
  negoStartsAt: Date | null;
  processEndsAt: Date | null;
  approvalStatus: $Enums.BidRoundApprovalStatus;
}): BidRoundStatus => {
  const { bidStartsAt, negoStartsAt, processEndsAt, approvalStatus } = record;
  return getBidRoundStatus({
    bidStartsAt: bidStartsAt ?? undefined,
    negoStartsAt: negoStartsAt ?? undefined,
    processEndsAt: processEndsAt ?? undefined,
    approvalStatus: approvalStatus as BidRoundApprovalStatus
  });
};

export const mapToBidRoundDTO = (record: BidRoundRecord): BidRoundT => {
  const status = getBidRoundStatusFromRecord(record);
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
