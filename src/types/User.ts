export type UserTypeT = "creator" | "buyer"

export type UserFormT = {
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
    meId?: (number | undefined) | undefined;
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
  creator?: CreatorT | null;
  buyer?: BuyerT | null;
}