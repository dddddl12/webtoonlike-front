type Dates = {
  bidStartsAt: Date;
  negoStartsAt: Date;
  processEndsAt: Date;
};

export function checkBidRoundValidity(dates: Partial<Dates>): Dates {

  const { bidStartsAt, negoStartsAt, processEndsAt } = dates;
  if (!bidStartsAt || !negoStartsAt || !processEndsAt) {
    throw new Error("누락된 날짜가 있습니다.");
  }
  if (bidStartsAt > negoStartsAt) {
    throw new Error("게시 시작일은 게시 종료일보다 이전이어야 합니다.");
  }

  if (bidStartsAt > negoStartsAt) {
    throw new Error("게시 시작일은 게시 종료일보다 이전이어야 합니다.");
  }
  return { bidStartsAt, negoStartsAt, processEndsAt };
}