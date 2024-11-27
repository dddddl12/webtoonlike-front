import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { BidRoundSchema, ContractRangeItemSchema } from "@/resources/bidRounds/dtos/bidRound.dto";
import { WebtoonDetailsSchema } from "@/resources/webtoons/dtos/webtoonDetails.dto";
import { OfferBuyerSchema, OfferCreatorSchema } from "@/resources/offers/dtos/offerUser.dto";
import { UserSchema } from "@/resources/users/dtos/user.dto";

export enum OfferProposalStatus {
  Superseded = "SUPERSEDED",
  Pending = "PENDING",
  Declined = "DECLINED",
  Accepted = "ACCEPTED",
}

export const OfferProposalContractRangeItemSchema = ContractRangeItemSchema.extend({
  message: z.string().optional(),
});

const OfferProposalBaseSchema = z.object({
  message: z.string().optional(),
  contractRange: z.array(OfferProposalContractRangeItemSchema),
});

export const OfferProposalFormSchema = OfferProposalBaseSchema;
export type OfferProposalFormT = z.infer<typeof OfferProposalFormSchema>;

export const OfferProposalSchema = OfferProposalBaseSchema
  .merge(ResourceSchema)
  .extend({
    status: z.nativeEnum(OfferProposalStatus),
    decidedAt: z.date().optional(),
  });
export type OfferProposalT = z.infer<typeof OfferProposalSchema>;


// /offers 오퍼 승인 또는 취소
export const changeOfferStatusParamsSchema = z.object({
  changeTo: z.enum([OfferProposalStatus.Accepted, OfferProposalStatus.Declined])
});
export type changeOfferStatusParamsT = z.infer<typeof changeOfferStatusParamsSchema>;

// 오퍼 제안 목록
export const OfferProposalListSchema = z.object({
  proposals: z.array(
    OfferProposalSchema.extend({
      user: UserSchema.pick({
        id: true,
        name: true,
        userType: true
      })
    })
  ),
  invoice: z.object({
    id: z.number(),
    createdAt: z.date(),
  }).optional(),
});
export type OfferProposalListT = z.infer<typeof OfferProposalListSchema>;

/* 상세 오퍼 제안 */
export const OfferProposalDetailsSchema = OfferProposalSchema
  .extend({
    offerId: z.number(),
    sender: z.union([
      OfferCreatorSchema,
      OfferBuyerSchema
    ]),
  });
export type OfferProposalDetailsT = z.infer<typeof OfferProposalDetailsSchema>;

/* 상세 오퍼 */
export const OfferDetailsSchema = OfferProposalSchema
  .extend({
    webtoon: WebtoonDetailsSchema.extend({
      activeBidRound: BidRoundSchema.pick({
        isNew: true,
        currentEpisodeNo: true,
        totalEpisodeCount: true,
      })
    }),
    creator: OfferCreatorSchema,
    buyer: OfferBuyerSchema
  });
export type OfferDetailsT = z.infer<typeof OfferDetailsSchema>;
