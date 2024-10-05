export function convertBidRoundStatus(status: "idle" | "waiting" | "bidding" | "negotiating" | "done" | undefined): string {
  switch (status) {
  case "idle":
    return "승인 대기";
  case "waiting":
    return "노출대기";
  case "bidding":
    return "노출 중";
  case "negotiating":
    return "협상 중";
  case "done":
    return "절차 완료";
  default:
    return "";
  }
}

export function convertBidRoundStatusEn(status: "idle" | "waiting" | "bidding" | "negotiating" | "done" | undefined): string {
  switch (status) {
  case "idle":
    return "Waiting for Approval";
  case "waiting":
    return "Exposure Waiting";
  case "bidding":
    return "Bidding";
  case "negotiating":
    return "Negotiation";
  case "done":
    return "Contract Done";
  default:
    return "";
  }
}