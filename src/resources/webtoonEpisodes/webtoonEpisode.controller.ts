"use server";

import {
  WebtoonEpisodeDetailsSchema,
  WebtoonEpisodeEnglishUrlFormSchema,
  WebtoonEpisodeFormSchema
} from "@/resources/webtoonEpisodes/webtoonEpisode.dto";
import z from "zod";
import { action } from "@/handlers/safeAction";
import webtoonEpisodeService from "@/resources/webtoonEpisodes/webtoonEpisode.service";


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
