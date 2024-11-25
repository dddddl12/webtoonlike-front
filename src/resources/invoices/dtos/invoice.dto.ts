import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { WebtoonPreviewSchema } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { UserSchema } from "@/resources/users/dtos/user.dto";

const InvoiceBaseSchema = z.object({
  bidRequestId: z.number(),
});

export const InvoiceSchema = InvoiceBaseSchema
  .merge(ResourceSchema);

export const InvoiceWithWebtoonSchema = InvoiceSchema
  .extend({
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
export type InvoiceWithWebtoonT = z.infer<typeof InvoiceWithWebtoonSchema>;
