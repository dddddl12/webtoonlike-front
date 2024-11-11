import { ContractRangeItemSchema } from "@/resources/bidRounds/bidRound.types";
import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

export enum BidRequestStatus {
  Pending = "PENDING",
  Waiting = "WAITING",
  Declined = "DECLINED",
  Negotiating = "NEGOTIATING",
  Aborted = "ABORTED",
  Done = "DONE",
}

// 대기 중, 거절 완료, 협상 중, 성사 완료, 협상 종료

const BidRequestBaseSchema = z.object({
  bidRoundId: z.number(),
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
    userId: z.number(),
    // status: z.nativeEnum(BidRequestStatus),
  });
export type BidRequestT = z.infer<typeof BidRequestSchema>;

export const BidRequestSchemaExtendedSchema = BidRequestSchema
  .extend({
    webtoon: z.object({
      id: z.number(),
      title: z.string(),
      title_en: z.string().optional(),
      thumbPath: z.string(),
    }),
    username: z.string(),
  });
export type BidRequestExtendedT = z.infer<typeof BidRequestSchemaExtendedSchema>;
