export type UserTypeT = "creator" | "buyer";
export type AdminLevel = 0 | 1 | 2;
//     0: 비관리자, 1: 일반 관리자, 2: 수퍼 관리자

export type UserFormT = {
    // TODO sub 없앨 것(보안을 위해 토큰으로 id 판단해야 함)
    sub: string;
    email: string;
    fullName: string;
    phone: string;
    userType: "creator" | "buyer";
    country: ("all" | "ko" | "en" | "zhCN" | "zhTW" | "de" | "id" | "ja" | "fr" | "vi" | "ms" | "th" | "es") | null;
    postCode: string | null;
    address: string | null;
    addressDetail: string | null;
}

type _UserT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    sub: string;
    email: string;
    fullName: string;
    phone: string;
    userType: "creator" | "buyer";
    country: ("all" | "ko" | "en" | "zhCN" | "zhTW" | "de" | "id" | "ja" | "fr" | "vi" | "ms" | "th" | "es") | null;
    postCode: string | null;
    address: string | null;
    addressDetail: string | null;
}

export type GetUserOptionT = {
    $buyer?: boolean | undefined;
    $creator?: boolean | undefined;
}

export type ListUserOptionT = {
    cursor?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    $numData?: boolean | undefined;
    meId?: ((number | undefined) | undefined) | undefined;
    $buyer?: (boolean | undefined) | undefined;
    $creator?: (boolean | undefined) | undefined;
    userType?: ("creator" | "buyer") | undefined;
}


// @type-gen remain
import type { CreatorT } from "./Creator";
import type { BuyerT } from "./Buyer";

export interface UserT extends _UserT {
  creator: CreatorT | null;
  buyer: BuyerT | null;
}

export interface UserWithBuyerT extends UserT {
  creator: null;
  buyer: BuyerT;
}

export interface UserWithCreatorT extends UserT {
  creator: CreatorT;
  buyer: null;
}

// Clerk
export type ClerkUserMetadata = {
    webtoonLikeId: number;
    type: UserTypeT;
    adminLevel: AdminLevel;
}