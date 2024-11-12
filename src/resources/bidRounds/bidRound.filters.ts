import { $Enums, Prisma } from "@prisma/client";

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