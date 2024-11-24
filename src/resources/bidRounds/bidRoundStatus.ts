import { BidRoundApprovalStatus, BidRoundStatus } from "@/resources/bidRounds/dtos/bidRound.dto";

export const getBidRoundStatus = ({
  bidStartsAt, negoStartsAt, processEndsAt, approvalStatus
}: {
  bidStartsAt?: Date;
  negoStartsAt?: Date;
  processEndsAt?: Date;
  approvalStatus: BidRoundApprovalStatus;
}): BidRoundStatus => {
  const now = new Date();
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
