export type CreatorFormT = {
    userId: number;
    name: string;
    name_en?: (string | null) | undefined;
    thumbPath?: (string | null) | undefined;
    agencyName: string | null;
    isNew: boolean;
    isExposed?: boolean | undefined;
}

type _CreatorT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    userId: number;
    name: string;
    name_en?: (string | null) | undefined;
    thumbPath?: (string | null) | undefined;
    agencyName: string | null;
    isNew: boolean;
    isExposed?: boolean | undefined;
}

export type GetCreatorOptionT = {
    meId?: number | undefined;
    $user?: boolean;
    $numWebtoon?: boolean;
    $numWebtoonLike?: boolean;
}

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


// @type-gen remain
import { UserT } from "./User";

export interface CreatorT extends _CreatorT {
  user?: UserT;
  numWebtoon?: number;
  numWebtoonLike?: number;
}