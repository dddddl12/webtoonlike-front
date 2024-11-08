import z from "zod";
import { BusinessFieldSchema, CountrySchema, ResourceSchema } from "@/resources/globalTypes";

export enum BidRoundStatus {
  Idle = "IDLE",
  Waiting = "WAITING",
  Bidding = "BIDDING",
  Negotiating = "NEGOTIATING",
  Done = "DONE",
}

export const ContractRangeItemSchema = z.object({
  contract: z.enum(["EXCLUSIVE", "NON_EXCLUSIVE"]),
  businessField: BusinessFieldSchema,
  country: CountrySchema,
});
export type ContractRangeItemT = z.infer<typeof ContractRangeItemSchema>;

export const ContractRange = z.array(ContractRangeItemSchema);

export const BidRoundBaseSchema = z.object({
  webtoonId: z.number(),
  contractRange: ContractRange,
  isOriginal: z.boolean(),
  isNew: z.boolean(),
  // TODO optional 체크
  currentEpisodeNo: z.number().min(1).optional(),
  episodeCount: z.number().min(1).optional(),
  monthlyEpisodeCount: z.number().min(1).optional(),
});

export const BidRoundFormSchema = BidRoundBaseSchema;
export type BidRoundFormT = z.infer<typeof BidRoundFormSchema>;

export const BidRoundSchema = ResourceSchema
  .merge(BidRoundBaseSchema)
  .extend({
    status: z.nativeEnum(BidRoundStatus),
    bidStartsAt: z.date().optional(),
    negoStartsAt: z.date().optional(),
    processEndsAt: z.date().optional(),
    approvedAt: z.date().optional(),
    disapprovedAt: z.date().optional(),
    // adminNote: z.string().optional(), TODO 어드민용 별도
  });
export type BidRoundT = z.infer<typeof BidRoundSchema>;

export const BidRoundExtendedSchema = BidRoundSchema
  .extend({
    bidRequestCount: z.number()
  });
export type BidRoundExtendedT = z.infer<typeof BidRoundExtendedSchema>;
