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
  Teens = "TEENS",
  Twenties = "TWENTIES",
  Thirties = "THIRTIES",
  Forties = "FORTIES",
  Fifties = "FIFTIES"
}

export enum TargetGender {
  All = "ALL",
  Male = "MALE",
  Female = "FEMALE"
}

const WebtoonBaseSchema = z.object({
  title: z.string().min(1),
  title_en: z.string().min(1),
  description: z.string().max(1000).optional(),
  description_en: z.string().max(1000).optional(),
  authorName: z.string().optional(),
  authorName_en: z.string().optional(),
  /** 외부 연재 중인 웹툰의 url */
  externalUrl: z.string().optional(),
  targetAges: z.array(z.nativeEnum(TargetAge)),
  ageLimit: z.nativeEnum(AgeLimit),
  targetGender: z.nativeEnum(TargetGender),
  thumbPath: z.string(),
});

export const WebtoonFormSchema = WebtoonBaseSchema.extend({
  genreIds: z.array(z.number()).min(1).max(2),
});
export type WebtoonFormT = z.infer<typeof WebtoonFormSchema>;

export const WebtoonSchema = ResourceSchema
  .merge(WebtoonBaseSchema);
export type WebtoonT = z.infer<typeof WebtoonSchema>;

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
    activeBidRound: BidRoundExtendedSchema.optional(),
    firstEpisodeId: z.number().optional()
  });
export type WebtoonExtendedT = z.infer<typeof WebtoonExtendedSchema>;

// 그리드에 표시하기 위한 기본폼
export const WebtoonPreviewSchema = z.object({
  id: z.number(),
  title: z.string(),
  title_en: z.string(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  thumbPath: z.string()
});
export type WebtoonPreviewT = z.infer<typeof WebtoonPreviewSchema>;
