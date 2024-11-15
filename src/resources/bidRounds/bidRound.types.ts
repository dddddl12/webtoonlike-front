import z from "zod";
import { BusinessFieldSchema, CountrySchema, ResourceSchema } from "@/resources/globalTypes";

export enum BidRoundApprovalStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Disapproved = "DISAPPROVED"
}

export enum BidRoundStatus {
  PendingApproval = "PENDING_APPROVAL",
  Disapproved = "Disapproved",

  // 아래는 승인 이후 단계
  Waiting = "WAITING", // < bidStartsAt
  Bidding = "BIDDING", // >= bidStartsAt && < negoStartsAt
  Negotiating = "NEGOTIATING", // >= negoStartsAt && < processEndsAt
  Done = "DONE", // >= processEndsAt
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
  currentEpisodeNo: z.number().min(0).optional(),
  totalEpisodeCount: z.number().min(0).optional(),
  monthlyEpisodeCount: z.number().min(0).optional(),
});

export const BidRoundFormSchema = BidRoundBaseSchema;
export type BidRoundFormT = z.infer<typeof BidRoundFormSchema>;

export const BidRoundAdminSettingsSchema = z.object({
  bidStartsAt: z.date().optional(),
  negoStartsAt: z.date().optional(),
  processEndsAt: z.date().optional(),
  adminNote: z.string().optional(),
});

export const BidRoundSchema = ResourceSchema
  .merge(BidRoundBaseSchema)
  .extend({
    status: z.nativeEnum(BidRoundStatus),
  });
export type BidRoundT = z.infer<typeof BidRoundSchema>;
