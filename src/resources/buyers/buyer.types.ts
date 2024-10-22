import { Resource } from "@/resources/globalTypes";

export type BuyerCompanyIndustry =
  "webtoon"
  | "game"
  | "movie"
  | "drama"
  | "webDrama"
  | "video"
  | "book"
  | "performance"
  | "etc";
export type BuyerCompanyType = "creator" | "investor" | "agent" | "platform" | "ott" | "management" | "etc";
export type BuyerPurpose = "privateContract" | "publicContract" | "publish" | "secondaryProperty" | "investment";

type BuyerCompanyInfo = {
  name: string;
  /** 대표이미지 */
  thumbPath?: string;
  /** 업체분야 */
  fieldType: BuyerCompanyIndustry[];
  /** 직종/업종 */
  businessType: BuyerCompanyType[];
  /** 부서 */
  dept?: string;
  /** 직책 */
  position?: string;
  /** 담당 업무 입력 */
  positionDetail?: string;
  /** 사업자등록번호 */
  businessNumber: string;
  /** 사업자등록증 파일 경로 */
  businessCertPath?: string;
  /** 명함 파일 경로 */
  businessCardPath?: string;
}

export type BuyerFormT = {
  companyInfo: BuyerCompanyInfo & {
    thumbnail?: File;
    businessCert?: File;
    businessCard?: File;
  };
  purpose?: BuyerPurpose;
}

export type BuyerT = Resource<BuyerFormT & {
  userId: number;
}>;
