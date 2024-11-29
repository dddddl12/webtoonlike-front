import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

const WebtoonEpisodeBaseSchema = z.object({
  episodeNo: z.number(),
  englishUrl: z.string().url().optional()
    .or(z.string().max(0)), // empty 값인 경우 고려
  imagePaths: z.array(z.string()).min(1),
});

export const WebtoonEpisodeFormSchema = WebtoonEpisodeBaseSchema
  .omit({
    englishUrl: true
    // 관리자 기능이므로 제외
  });
export type WebtoonEpisodeFormT = z.infer<typeof WebtoonEpisodeFormSchema>;


export const WebtoonEpisodeEnglishUrlFormSchema = WebtoonEpisodeBaseSchema
  .pick({
    englishUrl: true
  });
export type WebtoonEpisodeEnglishUrlFormT = z.infer<typeof WebtoonEpisodeEnglishUrlFormSchema>;


export const WebtoonEpisodeSchema = WebtoonEpisodeBaseSchema
  .merge(ResourceSchema)
  .extend({
    webtoonId: z.number(),
  });
export type WebtoonEpisodeT = z.infer<typeof WebtoonEpisodeSchema>;

export const WebtoonEpisodeDetailsSchema = WebtoonEpisodeSchema
  .extend({
    isEditable: z.boolean(),
    webtoon: z.object({
      id: z.number(),
      localized: z.object({
        title: z.string(),
      })
    }),
    navigation: z.object({
      previousId: z.number().optional(),
      nextId: z.number().optional(),
    })
  });
export type WebtoonEpisodeDetailsT = z.infer<typeof WebtoonEpisodeDetailsSchema>;
