import z from "zod";
import { BusinessFieldSchema } from "@/resources/globalTypes";

export const BuyerCompanyFieldSchema = BusinessFieldSchema;

// TODO enum 정리
export const BuyerCompanyTypeSchema = z.enum([
  "creator",
  "investor",
  "agent",
  "platform",
  "ott",
  "management",
  "etc"
]);
export const BuyerPurposeSchema = z.enum([
  "privateContract",
  "publicContract",
  "publish",
  "secondaryProperty",
  "investment"
]);

export const BuyerCompanySchema = z.object({
  /** 업체명 */
  name: z.string().min(1).max(100),
  /** 대표이미지 */
  thumbPath: z.string().optional(),
  /** 업체 분야 */
  fieldType: z.array(BuyerCompanyFieldSchema),
  /** 직종/업종 */
  businessType: z.array(BuyerCompanyTypeSchema),
  /** 부서 */
  dept: z.string().optional(),
  /** 직책 */
  position: z.string().optional(),
  /** 담당 업무 입력 */
  positionDetail: z.string().optional(),
  /** 사업자등록번호 */
  // TODO
  // businessNumber: z.string().min(10).max(10),
  businessNumber: z.string(),
  /** 사업자등록증 파일 경로 */
  businessCertPath: z.string().optional(),
  /** 명함 파일 경로 */
  businessCardPath: z.string().optional(),
});

const BuyerBaseSchema = z.object({
  company: BuyerCompanySchema,
  purpose: BuyerPurposeSchema.optional()
});

export const BuyerFormSchema = BuyerBaseSchema;
export type BuyerFormT = z.infer<typeof BuyerFormSchema>;

export const BuyerSchema = BuyerBaseSchema
  .merge(BuyerBaseSchema);
export type BuyerT = z.infer<typeof BuyerSchema>;

export const PublicBuyerInfoSchema = z.object({
  username: z.string(),
  company: z.object({
    name: z.string(),
    thumbPath: z.string().optional(),
    dept: z.string().optional(),
    position: z.string().optional(),
  })
});
export type PublicBuyerInfoT = z.infer<typeof PublicBuyerInfoSchema>;