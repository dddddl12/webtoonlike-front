import { ContractRangeItemSchema } from "@/resources/bidRounds/bidRound.types";
import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

// TODO 상태
export enum BidRequestStatus {
  Idle = "IDLE",
  Waiting = "WAITING",
  Bidding = "BIDDING",
  Negotiating = "NEGOTIATING",
  Done = "DONE",
}

// 대기 중, 거절 완료, 협상 중, 성사 완료, 협상 종료

const BidRequestBaseSchema = z.object({
  roundId: z.number(),
  message: z.string().optional(),
  contractRange: z.array(
    ContractRangeItemSchema.extend({
      message: z.string().optional(),
    })
  ),
});

export const BidRequestFormSchema = BidRequestBaseSchema;
export type BidRequestFormT = z.infer<typeof BidRequestFormSchema>;

export const BidRequestSchema = BidRequestBaseSchema
  .merge(ResourceSchema)
  .extend({
    userId: z.number().optional(),
    /** creator acceptance */
    acceptedAt: z.date().optional(),
    /** creator rejection */
    rejectedAt: z.date().optional(),
    /** admin approval */
    approvedAt: z.date().optional(),
    /** user cancel bid request */
    cancelledAt: z.date().optional(),
  });
export type BidRequestT = z.infer<typeof BidRequestSchema>;

export const BidRequestSchemaExtendedSchema = BidRequestSchema
  .extend({
    webtoon: z.object({
      id: z.number(),
      title: z.string(),
      title_en: z.string().optional(),
      thumbPath: z.string(),
    })
  });
export type BidRequestExtendedT = z.infer<typeof BidRequestSchemaExtendedSchema>;
