import type { BidRoundT } from "@/types";

export function checkBidRoundValidity(round: BidRoundT): BidRoundT {
  const now = new Date();
  const status = round.status;

  // idle -> all date should be null
  if (status == "idle") {
    round.bidStartAt = null;
    round.negoStartAt = null;
    return round;
  }

  if (!round.bidStartAt || !round.negoStartAt) {
    throw new Error("bidStartAt and negoStartAt must be set with status other than idle");
  }

  const bidStartAt = new Date(round.bidStartAt);
  const negoStartAt = new Date(round.negoStartAt);
  if (bidStartAt > negoStartAt) {
    throw new Error("게시 시작일은 게시 종료일보다 이전이어야 합니다.");
  }
  if (status == "waiting") {
    if (!(bidStartAt > now)) {
      throw new Error("노충 대기 중 작품의 게시 시작일은 현재시간보다 이후여야 합니다.");
    }
  }
  if (status === "bidding") {
    if (!(bidStartAt < now && now < negoStartAt)) {
      throw new Error("노출 중 게시 시작일은 현재보다 이전이고, 게시 종료일은 현재보다 이후여야 합니다.");
    }
  }
  if (status === "negotiating") {
    if (!(negoStartAt < now)) {
      throw new Error("협상 중 게시 종료일은 현재보다 이전이어야 합니다.");
    }
  }
  if (status === "done") {
    if (!(negoStartAt < now)) {
      throw new Error("협상 완료 상태의 게시 종료일은 현재보다 이전이어야 합니다.");
    }
  }
  return round;


}