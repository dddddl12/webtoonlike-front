import z from "zod";
import { UserT } from "@/resources/users/user.types";

export const BuyerCompanyFieldSchema = z.enum([
  "webtoon",
  "game",
  "movie",
  "drama",
  "webDrama",
  "video",
  "book",
  "performance",
  "etc"
]);
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

const BuyerCompanySchema = z.object({
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
  // TODO Form에서는 immutable하게 수정
  /** 사업자등록증 파일 경로 */
  businessCertPath: z.string().optional(),
  /** 명함 파일 경로 */
  businessCardPath: z.string().optional(),
});

const BuyerBaseSchema = z.object({
  companyInfo: BuyerCompanySchema,
  purpose: BuyerPurposeSchema.optional()
});

export const BuyerFormSchema = BuyerBaseSchema.extend({
  files: z.object({
    thumbnail: z.instanceof(File).optional(),
    businessCert: z.instanceof(File).optional(),
    businessCard: z.instanceof(File).optional(),
  })
});
export type BuyerFormT = z.infer<typeof BuyerFormSchema>;

export const BuyerSchema = BuyerBaseSchema
  .merge(BuyerBaseSchema);
export type BuyerT = z.infer<typeof BuyerSchema>;
