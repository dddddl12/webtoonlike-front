export function convertBidRequestStatus(
  status: "idle" | "waiting" | "bidding" | "negotiating" | "done" | undefined
): string {
  switch (status) {
    case "idle":
      return "마감 대기";
    case "waiting":
      return "답변 대기";
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

export function convertBidRequestStatusEn(
  status: "idle" | "waiting" | "bidding" | "negotiating" | "done" | undefined
): string {
  switch (status) {
    case "idle":
      return "Waiting for Closing";
    case "waiting":
      return "Waiting for Response";
    case "bidding":
      return "Bidding";
    case "negotiating":
      return "Negotiation";
    case "done":
      return "Procedure Completed";
    default:
      return "";
  }
}
