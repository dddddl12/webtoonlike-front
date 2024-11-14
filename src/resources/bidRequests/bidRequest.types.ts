import { ContractRangeItemSchema } from "@/resources/bidRounds/bidRound.types";
import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { WebtoonSchema } from "@/resources/webtoons/webtoon.types";
import { BuyerSchema } from "@/resources/buyers/buyer.types";
import { CreatorSchema } from "@/resources/creators/creator.types";
import { UserSchema } from "@/resources/users/user.types";

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
  bidRoundId: z.number(),
  message: z.string().optional(),
  contractRange: z.array(BidRequestContractRangeItemSchema),
});

export const BidRequestFormSchema = BidRequestBaseSchema;
export type BidRequestFormT = z.infer<typeof BidRequestFormSchema>;

export const BidRequestSchema = BidRequestBaseSchema
  .merge(ResourceSchema)
  .extend({
    userId: z.number(),
    status: z.nativeEnum(BidRequestStatus),
    decidedAt: z.date().optional(),
  });
export type BidRequestT = z.infer<typeof BidRequestSchema>;

export const BidRequestExtendedSchema = BidRequestSchema
  .extend({
    webtoon: WebtoonSchema,
    buyer: BuyerSchema.extend({
      user: UserSchema
    }),
    creator: CreatorSchema.extend({
      user: UserSchema
    }),
  });
