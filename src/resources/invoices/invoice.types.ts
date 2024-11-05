import { BidRequestT } from "@/resources/bidRequests/bidRequest.types";
import { WebtoonT } from "@/resources/webtoons/webtoon.types";
import { CreatorT } from "@/resources/creators/creator.types";
import { BuyerT } from "@/resources/buyers/buyer.types";
import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

const InvoiceBaseSchema = z.object({
  bidRequestId: z.number(),
});

export const InvoiceFormSchema = InvoiceBaseSchema;
export type InvoiceFormT = z.infer<typeof InvoiceBaseSchema>;

export const InvoiceSchema = InvoiceBaseSchema
  .merge(ResourceSchema);
export type InvoiceT = z.infer<typeof InvoiceSchema>;

export const InvoiceExtendedSchema = InvoiceSchema
  .extend({
    webtoon: z.object({
      id: z.number(),
      title: z.string(),
      title_en: z.string().optional(),
      thumbPath: z.string()
    }),
    creatorUsername: z.string(),
    buyerUsername: z.string()
  });
export type InvoiceExtendedT = z.infer<typeof InvoiceExtendedSchema>;