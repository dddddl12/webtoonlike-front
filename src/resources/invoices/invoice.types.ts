import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { BidRequestContractRangeItemSchema } from "@/resources/bidRequests/bidRequest.types";

const InvoiceContentUser = z.object({
  id: z.number(),
  name: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  phone: z.string(),
});
export const InvoiceContent = z.object({
  // 추후 저장 데이터가 변경될 때를 대비한 버전 기록
  // 버전이 여러개가 되면 버전명에 따라 parsing을 달리할 것
  templateVersion: z.literal(0),
  buyer: z.object({
    id: z.number(),
    name: z.string(),
    businessNumber: z.string().optional(),
    user: InvoiceContentUser
  }),
  creator: z.object({
    id: z.number(),
    name: z.string(),
    name_en: z.string().optional(),
    user: InvoiceContentUser
  }),
  webtoon: z.object({
    id: z.number(),
    title: z.string(),
    title_en: z.string(),
  }),
  bidRequest: z.object({
    id: z.number(),
    contractRange: z.array(BidRequestContractRangeItemSchema)
    //   TODO parsing 조건은 모두 이것으로 대체
  }),
  issuedAt: z.date(),
});
export type InvoiceContentT = z.infer<typeof InvoiceContent>;

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