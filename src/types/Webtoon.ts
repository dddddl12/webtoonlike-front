export type WebtoonFormT = {
    authorId: number | null;
    title: string;
    title_en: string | null;
    description?: (string | null) | undefined;
    description_en?: (string | null) | undefined;
    authorDetail?: (string | null) | undefined;
    authorDetail_en?: (string | null) | undefined;
    thumbHost?: (string | null) | undefined;
    thumbPath?: (string | null) | undefined;
    numLike?: number | undefined;
    /** 외부 연재 중인 웹툰의 url */
    externalUrl?: (string | null) | undefined;
    /** 영어 번역 url */
    englishUrl?: (string | null) | undefined;
    adultOnly?: boolean | undefined;
    targetAge?: ({
        data: ("10-20" | "20-30" | "30-40" | "40-50" | "50-60")[];
    } | null) | undefined;
    ageLimit?: (("12+" | "15+" | "18+") | null) | undefined;
    targetGender?: (("male" | "female") | null) | undefined;
    modifiedAt?: (Date | null) | undefined;
    publishedAt?: (Date | null) | undefined;
}

type _WebtoonT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    authorId: number | null;
    title: string;
    title_en: string | null;
    description?: (string | null) | undefined;
    description_en?: (string | null) | undefined;
    authorDetail?: (string | null) | undefined;
    authorDetail_en?: (string | null) | undefined;
    thumbHost?: (string | null) | undefined;
    thumbPath?: (string | null) | undefined;
    numLike: number;
    /** 외부 연재 중인 웹툰의 url */
    externalUrl?: (string | null) | undefined;
    /** 영어 번역 url */
    englishUrl?: (string | null) | undefined;
    adultOnly?: boolean | undefined;
    targetAge?: ({
        data: ("10-20" | "20-30" | "30-40" | "40-50" | "50-60")[];
    } | null) | undefined;
    ageLimit?: (("12+" | "15+" | "18+") | null) | undefined;
    targetGender?: (("male" | "female") | null) | undefined;
    modifiedAt?: (Date | null) | undefined;
    publishedAt?: (Date | null) | undefined;
}

export type GetWebtoonOptionT = {
    meId?: (number | undefined) | undefined;
    $creator?: boolean | undefined;
    $episodes?: boolean | undefined;
    $numEpisode?: boolean | undefined;
    $numRequest?: boolean | undefined;
    $myLike?: boolean | undefined;
    $bidRounds?: boolean | undefined;
    $genres?: boolean | undefined;
}

export type ListWebtoonOptionT = {
    cursor?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    $numData?: boolean | undefined;
    meId?: ((number | undefined) | undefined) | undefined;
    $creator?: (boolean | undefined) | undefined;
    $episodes?: (boolean | undefined) | undefined;
    $numEpisode?: (boolean | undefined) | undefined;
    $numRequest?: (boolean | undefined) | undefined;
    $myLike?: (boolean | undefined) | undefined;
    $bidRounds?: (boolean | undefined) | undefined;
    $genres?: (boolean | undefined) | undefined;
    sort?: ("recent" | "old" | "popular") | undefined;
    authorId?: number | undefined;
    like?: ("only" | "except") | undefined;
    mine?: ("only" | "except") | undefined;
    /** pass comma separated string for array of status */
    bidStatus?: (("idle" | "waiting" | "bidding" | "negotiating" | "done") | string) | undefined;
    ageLimit?: ("12+" | "15+" | "18+") | undefined;
    genreId?: number | undefined;
}

export type WebtoonSortT = "recent" | "old" | "popular"


// @type-gen remain
import { WebtoonEpisodeT } from "./WebtoonEpisode";
import { WebtoonLikeT } from "./WebtoonLike";
import { BidRoundT } from "./BidRound";
import { CreatorT } from "./Creator";
import { GenreT } from "./Genre";

export interface WebtoonT extends _WebtoonT {
  creator?: CreatorT|null
  episodes?: WebtoonEpisodeT[]
  numEpisode?: number
  numRequest?: number
  myLike?: WebtoonLikeT
  bidRounds?: BidRoundT[]
  genres?: GenreT[]
}