import { WebtoonEpisodeImageT } from "@/resources/webtoonEpisodeImages/webtoonEpisodeImage.types";
import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

const WebtoonEpisodeBaseSchema = z.object({
  webtoonId: z.number(),
  episodeNo: z.number(),
  title: z.string().optional(),
  title_en: z.string().optional(),
  description: z.string().optional(),
  // thumbPath: z.string().optional(),
  englishUrl: z.string().optional()
});


export const WebtoonEpisodeSchema = WebtoonEpisodeBaseSchema
  .merge(ResourceSchema);
export type WebtoonEpisodeT = z.infer<typeof WebtoonEpisodeSchema>;

export const WebtoonEpisodeExtendedSchema = WebtoonEpisodeSchema
  .extend({
    isEditable: z.boolean(),
    webtoon: z.object({
      id: z.number(),
      title: z.string(),
      title_en: z.string().optional(),
    }),
    images: z.array(
      z.object({
        id: z.number(),
        path: z.string(),
      })
    ),
    navigation: z.object({
      previousId: z.number().optional(),
      nextId: z.number().optional(),
    })
  });
export type WebtoonEpisodeExtendedT = z.infer<typeof WebtoonEpisodeExtendedSchema>;