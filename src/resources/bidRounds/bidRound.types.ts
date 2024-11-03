import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

export enum BidRoundStatus {
  Idle = "IDLE",
  Waiting = "WAITING",
  Bidding = "BIDDING",
  Negotiating = "NEGOTIATING",
  Done = "DONE",
}

const ContractRangeExclusivitySchema = z.enum(["exclusive", "nonExclusive"]);

export const ContractRangeBusinessFieldSchema = z.enum([
  "all",
  "webtoon",
  "movie",
  "drama",
  "webDrama",
  "ads",
  "musical",
  "game",
  "book",
  "product",
]);

export const ContractRangeCountrySchema = z.enum([
  "all",
  "ko",
  "en",
  "zhCN",
  "zhTW",
  "de",
  "id",
  "ja",
  "fr",
  "vi",
  "ms",
  "th",
  "es",
]);

export const ContractRangeItemSchema = z.object({
  contract: ContractRangeExclusivitySchema,
  businessField: ContractRangeBusinessFieldSchema,
  country: ContractRangeCountrySchema,
});

export const ContractRange = z.array(ContractRangeItemSchema);

export const BidRoundBaseSchema = z.object({
  webtoonId: z.number(),
  contractRange: ContractRange,
  isOriginal: z.boolean(),
  isNew: z.boolean(),
  // TODO optional 체크
  episodeCount: z.number().min(1).optional(),
  currentEpisodeNo: z.number().min(1).optional(),
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
