import { CreatorT } from "@/resources/creators/creator.types";
import { WebtoonEpisodeT } from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { BidRoundT } from "@/resources/bidRounds/bidRound.types";
import { GenreT } from "@/resources/genres/genre.types";
import { Resource } from "@/resources/globalTypes";

export enum AgeLimit {
    All = "ALL",
    Twelve = "TWELVE",
    Fifteen = "FIFTEEN",
    Eighteen = "EIGHTEEN"
}

export enum TargetAge {
    All = "ALL",
    Teens = "TEENS",
    Twenties = "TWENTIES",
    Thirties = "THIRTIES",
    Forties = "FORTIES",
    Fifties = "FIFTIES"
}

export enum TargetGender {
  Male = "MALE",
  Female = "FEMALE"
}

export type WebtoonFormT = {
    title: string;
    title_en: string | null;
    description: string | null;
    description_en: string | null;
    thumbNail: File | null;
    /** 외부 연재 중인 웹툰의 url */
    externalUrl: string | null;
    /** 영어 번역 url */
    englishUrl: string | null;
    adultOnly: boolean;
    targetAge: TargetAge[];
    ageLimit: AgeLimit;
    targetGender: TargetGender | null;
}

type _WebtoonT = Resource<Omit<WebtoonFormT & {
    authorId: number | null;
    thumbPath: string | null;
    numLike: number;
    publishedAt: Date | null;
}, "thumbNail">>

export interface WebtoonT extends _WebtoonT {
  creator?: CreatorT
  episodes?: WebtoonEpisodeT[]
  numEpisode?: number
  numRequest?: number
  myLike?: boolean
  bidRounds?: BidRoundT[]
  genres?: GenreT[]
}

export type HomeWebtoonItem = {
    id: number;
    thumbPath: string | null;
    title: string;
    title_en: string | null;
    creatorName: string | null;
    creatorName_en: string | null;
}

export type HomeArtistItem = {
    id: number;
    thumbPath: string | null;
    name: string;
    name_en: string | null;
    numOfWebtoons: number;
}