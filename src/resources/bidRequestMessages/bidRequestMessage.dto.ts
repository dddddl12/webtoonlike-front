import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

const BidRequestMessageBaseSchema = z.object({
  bidRequestId: z.number(),
  content: z.string(),
});

export const BidRequestMessageFormSchema = BidRequestMessageBaseSchema;
export type BidRequestMessageFormT = z.infer<typeof BidRequestMessageFormSchema>;

export const BidRequestMessageSchema = BidRequestMessageBaseSchema
  .merge(ResourceSchema);
export type BidRequestMessageT = z.infer<typeof BidRequestMessageSchema>;
