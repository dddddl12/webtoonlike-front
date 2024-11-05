import { BidRoundExtendedSchema } from "@/resources/bidRounds/bidRound.types";
import { ResourceSchema } from "@/resources/globalTypes";
import z from "zod";

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

const WebtoonBaseSchema = z.object({
  title: z.string(),
  title_en: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  /** 외부 연재 중인 웹툰의 url */
  externalUrl: z.string().optional(),
  /** 영어 번역 url */
  englishUrl: z.string().optional(),
  adultOnly: z.boolean(),
  targetAges: z.array(z.nativeEnum(TargetAge)),
  ageLimit: z.nativeEnum(AgeLimit),
  targetGender: z.nativeEnum(TargetGender)
});

export const WebtoonFormSchema = WebtoonBaseSchema.extend({
  authorName: z.string().optional(),
  authorName_en: z.string().optional(),
  files: z.object({
    thumbnail: z.instanceof(File).optional(),
  })
});

export const WebtoonSchema = ResourceSchema
  .merge(WebtoonBaseSchema)
  .extend({
    thumbPath: z.string(),
  });
export type WebtoonT = z.infer<typeof WebtoonSchema>

export const WebtoonExtendedSchema = WebtoonSchema
  .extend({
    // From joined tables
    isEditable: z.boolean(),
    authorOrCreatorName: z.string(),
    authorOrCreatorName_en: z.string().optional(),
    likeCount: z.number(),
    myLike: z.boolean(),
    genres: z.array(z.object({
      id: z.number(),
      label: z.string(),
      label_en: z.string().optional(),
    })),
    bidRound: BidRoundExtendedSchema.optional(),
    firstEpisodeId: z.number().optional()
  });
export type WebtoonExtendedT = z.infer<typeof WebtoonExtendedSchema>

export type HomeWebtoonItem = {
  id: number;
  thumbPath?: string;
  title: string;
  title_en?: string;
  authorOrCreatorName?: string;
  authorOrCreatorName_en?: string;
}

export type HomeArtistItem = {
  id: number;
  thumbPath?: string;
  name: string;
  name_en?: string;
  numOfWebtoons: number;
}