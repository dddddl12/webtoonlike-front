import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

const WebtoonEpisodeBaseSchema = z.object({
  episodeNo: z.number(),
  englishUrl: z.string().optional(),
  imagePaths: z.array(z.string()),
});

export const WebtoonEpisodeFormSchema = WebtoonEpisodeBaseSchema;
export type WebtoonEpisodeFormT = z.infer<typeof WebtoonEpisodeFormSchema>;


export const WebtoonEpisodeSchema = WebtoonEpisodeBaseSchema
  .merge(ResourceSchema)
  .extend({
    webtoonId: z.number(),
  });
export type WebtoonEpisodeT = z.infer<typeof WebtoonEpisodeSchema>;

export const WebtoonEpisodeExtendedSchema = WebtoonEpisodeSchema
  .extend({
    isEditable: z.boolean(),
    webtoon: z.object({
      id: z.number(),
      title: z.string(),
      title_en: z.string().optional(),
    }),
    navigation: z.object({
      previousId: z.number().optional(),
      nextId: z.number().optional(),
    })
  });
export type WebtoonEpisodeExtendedT = z.infer<typeof WebtoonEpisodeExtendedSchema>;