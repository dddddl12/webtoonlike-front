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
  thumbPath: z.string().min(1),
//   todo min 필수 확인
});

export const WebtoonFormSchema = WebtoonBaseSchema.extend({
  genreIds: z.array(z.number()).min(1).max(2),
});
export type WebtoonFormT = z.infer<typeof WebtoonFormSchema>;

// 기본폼
export const WebtoonSchema = ResourceSchema
  .merge(WebtoonBaseSchema)
  .extend({
    localized: z.object({
      title: z.string(),
      description: z.string().optional(),
    })
  });
export type WebtoonT = z.infer<typeof WebtoonSchema>;