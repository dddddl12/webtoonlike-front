// 홈 화면

import { AgeLimit } from "@/resources/webtoons/webtoon.types";
import z from "zod";

export const HomeWebtoonItemSchema = z.object({
  id: z.number(),
  thumbPath: z.string(),
  title: z.string(),
  title_en: z.string(),
  authorOrCreatorName: z.string(),
  authorOrCreatorName_en: z.string().optional(),
  creator: z.object({
    user: z.object({
      id: z.number(),
    })
  })
});
export type HomeWebtoonItem = z.infer<typeof HomeWebtoonItemSchema>;

export const BannerWebtoonItemSchema = HomeWebtoonItemSchema.extend({
  offers: z.number(),
  ageLimit: z.nativeEnum(AgeLimit),
  isNew: z.boolean()
});
export type BannerWebtoonItem = z.infer<typeof BannerWebtoonItemSchema>;

export type HomeGenreItem = {
  id: number;
  label: string;
  label_en?: string;
};

export type HomeCreatorItem = {
  id: number;
  thumbPath?: string;
  name: string;
  name_en?: string;
  numOfWebtoons: number;
};