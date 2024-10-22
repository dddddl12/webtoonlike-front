import { Resource } from "@/resources/globalTypes";

export enum UserTypeT {
  Creator = "CREATOR",
  Buyer = "BUYER"
}

export type UserFormT = {
    // TODO 마이그레이션 완료 후 이메일 삭제
    email: string;
  phone: string;
  userType: UserTypeT;
  // country: "all" | "ko" | "en" | "zhCN" | "zhTW" | "de" | "id" | "ja" | "fr" | "vi" | "ms" | "th" | "es" | null; // TODO
  country: string;
  postCode: string;
  address: string;
  addressDetail: string;
  agreed: boolean;
}

export type UserT = Resource<{
    sub: string;
    email: string;
    phone: string;
    userType: UserTypeT;
    country: string | null;
    postCode: string | null;
    address: string | null;
    addressDetail: string | null;
}>;

export type GetUserOptionT = {
  $buyer?: boolean;
  $creator?: boolean;
}

export type ListUserOptionT = {
  cursor?: string;
  limit?: number;
  offset?: number;
  $numData?: boolean;
  meId?: number;
  $buyer?: boolean;
  $creator?: boolean;
  userType?: UserTypeT;
}
