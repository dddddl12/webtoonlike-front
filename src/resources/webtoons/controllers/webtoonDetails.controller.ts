"use server";

// /webtoon/create
// /webtoon/[webtoonId]/update
import { action } from "@/handlers/safeAction";
import z from "zod";
import { WebtoonDetailsExtendedSchema, WebtoonDetailsSchema } from "@/resources/webtoons/dtos/webtoonDetails.dto";
import webtoonDetailsService from "@/resources/webtoons/services/webtoonDetails.service";

export const getWebtoon = action
  .metadata({ actionName: "getWebtoon" })
  .bindArgsSchemas([
    z.number() // webtoonId
  ])
  .outputSchema(WebtoonDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [webtoonId]
  }) => {
    return webtoonDetailsService.getDetails(webtoonId);
  });

// /webtoon/[webtoonId]
export const getWebtoonDetailsExtended = action
  .metadata({ actionName: "getWebtoonDetailsExtended" })
  .bindArgsSchemas([
    z.number() // webtoonId
  ])
  .outputSchema(WebtoonDetailsExtendedSchema)
  .action(async ({
    bindArgsParsedInputs: [webtoonId]
  }) => {
    return webtoonDetailsService.getDetailsExtended(webtoonId);
  });
