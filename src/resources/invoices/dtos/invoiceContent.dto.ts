import z from "zod";
import { OfferProposalSchema } from "@/resources/offers/dtos/offerProposal.dto";

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
  offerProposal: OfferProposalSchema.extend({
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    decidedAt: z.coerce.date().optional(),
  }),
  issuedAt: z.coerce.date(),
});
export type InvoiceContentT = z.infer<typeof InvoiceContent>;