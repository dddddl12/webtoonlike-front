// 홈 화면

import z from "zod";
import { AgeLimit } from "@/resources/webtoons/dtos/webtoon.dto";

export const HomeWebtoonItemSchema = z.object({
  id: z.number(),
  thumbPath: z.string(),
  localized: z.object({
    title: z.string(),
    authorOrCreatorName: z.string(),
  }),
  creator: z.object({
    user: z.object({
      id: z.number(),
    })
  })
});
export type HomeWebtoonItem = z.infer<typeof HomeWebtoonItemSchema>;

const BannerWebtoonItemSchema = HomeWebtoonItemSchema.extend({
  offers: z.number(),
  ageLimit: z.nativeEnum(AgeLimit),
  isNew: z.boolean()
});

const HomeGenreItemSchema = z.object({
  id: z.number(),
  localized: z.object({
    label: z.string(),
  }),
});

const HomeCreatorItemSchema = z.object({
  id: z.number(),
  thumbPath: z.string().optional(),
  webtoonCount: z.number(),
  localized: z.object({
    name: z.string(),
  })
});

export const HomeItemsSchema = z.object({
  banners: z.array(BannerWebtoonItemSchema),
  popular: z.array(HomeWebtoonItemSchema),
  brandNew: z.array(HomeWebtoonItemSchema),
  genreSets: z.object({
    genres: z.array(HomeGenreItemSchema),
    firstGenreItems: z.array(HomeWebtoonItemSchema).optional(),
  }),
  creators: z.array(HomeCreatorItemSchema)
});
export type HomeItemsT = z.infer<typeof HomeItemsSchema>;