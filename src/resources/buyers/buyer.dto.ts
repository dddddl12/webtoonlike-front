import z from "zod";
import { BusinessFieldSchema } from "@/resources/globalTypes";

export const BuyerCompanyFieldSchema = BusinessFieldSchema;

export const BuyerCompanyTypeSchema = z.enum([
  "CREATOR",
  "INVESTOR",
  "AGENT",
  "PLATFORM",
  "OTT",
  "MANAGEMENT",
  "OTHER"
]);
export const BuyerPurposeSchema = z.enum([
  "EXCLUSIVE_CONTRACT",
  "NON_EXCLUSIVE_CONTRACT",
  "PUBLICATION",
  "DERIVATIVE_WORKS",
  "INVESTMENT"
]);

const BuyerBaseSchema = z.object({
  /** 업체명 */
  name: z.string().min(1, "required").max(100),
  /** 대표이미지 */
  thumbPath: z.string().optional(),
  /** 업체 분야 */
  businessField: z.array(BuyerCompanyFieldSchema).min(1, "required"),
  /** 직종/업종 */
  businessType: z.array(BuyerCompanyTypeSchema).min(1, "required"),
  /** 부서 */
  department: z.string().min(1, "required"),
  /** 직책 */
  position: z.string().min(1, "required"),
  /** 담당 업무 입력 */
  role: z.string().min(1, "required"),
  /** 사업자등록번호 */
  // TODO
  businessNumber: z.string()
    .regex(/^([0-9]{3})-?([0-9]{2})-?([0-9]{5})$/, "invalidBusinessNoFormat"),
  /** 사업자등록증 파일 경로 */
  businessCertificatePath: z.string().optional(),
  /** 명함 파일 경로 */
  businessCardPath: z.string().optional(),
  /** 가입 목적 */
  purpose: BuyerPurposeSchema
});

export const BuyerFormSchema = BuyerBaseSchema;
export type BuyerFormT = z.infer<typeof BuyerFormSchema>;

export const BuyerSchema = BuyerBaseSchema
  .merge(BuyerBaseSchema);
