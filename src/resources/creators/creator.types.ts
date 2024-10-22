import { UserT } from "@/resources/users/user.types";

export type CreatorFormT = {
    userId: number;
    name: string;
    name_en?: string;
    thumbPath?: string;
    agencyName?: string;
    isNew: boolean;
    isExposed: boolean;
}

type _CreatorT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
} & CreatorFormT;

export type GetCreatorOptionT = {
    meId?: number;
    $user?: boolean;
    $numWebtoon?: boolean;
    $numWebtoonLike?: boolean;
}

// TODO 불필요한  | undefined 제거
export type ListCreatorOptionT = {
    cursor?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    $numData?: boolean | undefined;
    meId?: (number | undefined) | undefined;
    $user?: boolean | undefined;
    $numWebtoon?: boolean | undefined;
    $numWebtoonLike?: boolean | undefined;
    sort?: ("recent") | undefined;
    exposed?: ("only") | undefined;
}


export interface CreatorT extends _CreatorT {
  user?: UserT;
  numWebtoon?: number;
  numWebtoonLike?: number;
}