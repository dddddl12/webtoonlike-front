import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { WebtoonPreviewSchema } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { UserSchema } from "@/resources/users/dtos/user.dto";
import { OfferProposalSchema } from "@/resources/offers/dtos/offerProposal.dto";

const OfferBaseSchema = z.object({});

export const OfferSchema = OfferBaseSchema
  .merge(ResourceSchema)
  .extend({
    bidRoundId: z.number(),
    userId: z.number()
  });
export type OfferT = z.infer<typeof OfferSchema>;

/* 관리자 > 오퍼 관리에 사용 */
export const OfferWithActiveProposalSchema = OfferSchema.extend({
  activeOfferProposal: OfferProposalSchema,
  buyer: z.object({
    user: UserSchema.pick({
      id: true,
      name: true
    })
  })
});
export type OfferWithActiveProposalT = z.infer<typeof OfferWithActiveProposalSchema>;

/* 바이어, 저작권자, 웹툰 정보 포함 - 오퍼 목록에 사용 */
export const OfferWithBuyerAndWebtoonSchema = OfferWithActiveProposalSchema.extend({
  webtoon: WebtoonPreviewSchema,
  creator: z.object({
    user: UserSchema.pick({
      id: true,
      name: true
    })
  })
});
export type OfferWithBuyerAndWebtoonT = z.infer<typeof OfferWithBuyerAndWebtoonSchema>;
