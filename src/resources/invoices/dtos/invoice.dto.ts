import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { WebtoonPreviewSchema } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { UserSchema } from "@/resources/users/dtos/user.dto";
import { OfferProposalSchema } from "@/resources/offers/dtos/offerProposal.dto";

const InvoiceBaseSchema = z.object({});

export const InvoiceSchema = InvoiceBaseSchema
  .merge(ResourceSchema);

export const InvoicedOfferSchema = z.object({
  invoice: InvoiceSchema,
  offerProposal: OfferProposalSchema.pick({
    id: true,
    decidedAt: true
  }),
  webtoon: WebtoonPreviewSchema,
  creator: z.object({
    user: UserSchema.pick({
      id: true,
      name: true
    })
  }),
  buyer: z.object({
    user: UserSchema.pick({
      id: true,
      name: true
    })
  })
});
export type InvoicedOfferT = z.infer<typeof InvoicedOfferSchema>;

export const UninvoicedOfferSchema = InvoicedOfferSchema.omit({
  invoice: true,
});
export type UninvoicedOfferT = z.infer<typeof UninvoicedOfferSchema>;
