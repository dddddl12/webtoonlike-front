import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

const InvoiceBaseSchema = z.object({
  bidRequestId: z.number(),
});

export const InvoiceSchema = InvoiceBaseSchema
  .merge(ResourceSchema);

export const InvoiceWithWebtoonSchema = InvoiceSchema
  .extend({
    webtoon: z.object({
      id: z.number(),
      thumbPath: z.string(),
      localized: z.object({
        title: z.string()
      })
    }),
    creatorUsername: z.string(),
    buyerUsername: z.string()
  });
export type InvoiceWithWebtoonT = z.infer<typeof InvoiceWithWebtoonSchema>;
