import { $Enums, BidRound as BidRoundRecord, Prisma } from "@prisma/client";
import { BidRoundApprovalStatus, BidRoundStatus, BidRoundT, ContractRange } from "@/resources/bidRounds/bidRound.types";

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

export const getBidRoundStatus = (record: {
  bidStartsAt: Date | null;
  negoStartsAt: Date | null;
  processEndsAt: Date | null;
  approvalStatus: $Enums.BidRoundApprovalStatus;
}): BidRoundStatus => {
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

export const mapToBidRoundDTO = (record: BidRoundRecord): BidRoundT => {
  const status = getBidRoundStatus(record);
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
