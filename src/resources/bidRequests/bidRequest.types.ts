import { ContractRangeItemSchema } from "@/resources/bidRounds/bidRound.types";
import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

export enum BidRequestStatus {
  Pending = "PENDING",
  Waiting = "WAITING",
  Negotiating = "NEGOTIATING",
  Declined = "DECLINED",
  Accepted = "ACCEPTED",
}

export const BidRequestContractRangeItemSchema = ContractRangeItemSchema.extend({
  message: z.string().optional(),
});
const BidRequestBaseSchema = z.object({
  message: z.string().optional(),
  contractRange: z.array(BidRequestContractRangeItemSchema),
});

export const BidRequestFormSchema = BidRequestBaseSchema;
export type BidRequestFormT = z.infer<typeof BidRequestFormSchema>;

export const BidRequestSchema = BidRequestBaseSchema
  .merge(ResourceSchema)
  .extend({
    bidRoundId: z.number(),
    userId: z.number(),
    status: z.nativeEnum(BidRequestStatus),
    decidedAt: z.date().optional(),
  });
export type BidRequestT = z.infer<typeof BidRequestSchema>;
