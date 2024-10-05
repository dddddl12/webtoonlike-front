export type BuyerFormT = {
    userId: number;
    name: string;
    companyInfo: {
        name: string;
        /** 대표이미지 */
        thumbPath: string;
        /** 업체분야 */
        fieldType: ("webtoon" | "game" | "movie" | "drama" | "webDrama" | "video" | "book" | "performance" | "etc")[];
        /** 직종/업종 */
        businessType: ("creator" | "investor" | "agent" | "platform" | "ott" | "management" | "etc")[];
        /** 부서 */
        dept?: (string | null) | undefined;
        /** 직책 */
        position?: (string | null) | undefined;
        /** 담당 업무 입력 */
        positionDetail?: (string | null) | undefined;
        /** 사업자등록번호 */
        businessNumber: string;
        /** 사업자등록증 파일 경로 */
        businessCertPath: string;
        /** 명함 파일 경로 */
        businessCardPath: string;
    };
    purpose?: (("privateContract" | "publicContract" | "publish" | "secondaryProperty" | "investment") | null) | undefined;
}

type _BuyerT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    userId: number;
    name: string;
    companyInfo: {
        name: string;
        /** 대표이미지 */
        thumbPath: string;
        /** 업체분야 */
        fieldType: ("webtoon" | "game" | "movie" | "drama" | "webDrama" | "video" | "book" | "performance" | "etc")[];
        /** 직종/업종 */
        businessType: ("creator" | "investor" | "agent" | "platform" | "ott" | "management" | "etc")[];
        /** 부서 */
        dept?: (string | null) | undefined;
        /** 직책 */
        position?: (string | null) | undefined;
        /** 담당 업무 입력 */
        positionDetail?: (string | null) | undefined;
        /** 사업자등록번호 */
        businessNumber: string;
        /** 사업자등록증 파일 경로 */
        businessCertPath: string;
        /** 명함 파일 경로 */
        businessCardPath: string;
    };
    purpose?: (("privateContract" | "publicContract" | "publish" | "secondaryProperty" | "investment") | null) | undefined;
}

export type GetBuyerOptionT = {
    meId?: number | undefined;
}

export type ListBuyerOptionT = {
    meId?: number | undefined;
}


// @type-gen remain
import type { UserT } from "@/types/User";

export interface BuyerT extends _BuyerT {
  user?: UserT
}