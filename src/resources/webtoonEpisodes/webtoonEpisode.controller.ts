"use server";

import {
  WebtoonEpisodeEnglishUrlFormSchema,
  WebtoonEpisodeFormSchema,
  WebtoonEpisodeSchema
} from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import z from "zod";
import { action } from "@/handlers/safeAction";
import webtoonEpisodeService from "@/resources/webtoonEpisodes/webtoonEpisode.service";


const WebtoonEpisodeDetailsSchema = WebtoonEpisodeSchema
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
export type WebtoonEpisodeDetailsT = z.infer<typeof WebtoonEpisodeDetailsSchema>;
export const getEpisode = action
  .metadata({ actionName: "getEpisode" })
  .bindArgsSchemas([
    z.number(), // webtoonId
    z.number() // episodeId
  ])
  .outputSchema(WebtoonEpisodeDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [webtoonId, episodeId],
  }) => {
    return webtoonEpisodeService.get(webtoonId, episodeId);
  });

export const createOrUpdateEpisode = action
  .metadata({ actionName: "createOrUpdateEpisode" })
  .schema(WebtoonEpisodeFormSchema)
  .bindArgsSchemas([
    z.number(), // webtoonId
    z.number().optional() // episodeId
  ])
  .action(async ({
    parsedInput: formData,
    bindArgsParsedInputs: [webtoonId, episodeId],
  }) => {
    // todo 0번 고려
    if (episodeId !== undefined) {
      await webtoonEpisodeService.update(webtoonId, episodeId, formData);
    } else {
      await webtoonEpisodeService.create(webtoonId, formData);
    }
  });

// Admin only
export const updateEpisodeEnglishUrl = action
  .metadata({ actionName: "updateEpisodeEnglishUrl" })
  .bindArgsSchemas([
    z.number(), // webtoonId
    z.number() // episodeId
  ])
  .schema(WebtoonEpisodeEnglishUrlFormSchema)
  .action(async ({
    parsedInput: formData,
    bindArgsParsedInputs: [webtoonId, episodeId],
  }) => {
    await webtoonEpisodeService.update(webtoonId, episodeId, formData);
  });
