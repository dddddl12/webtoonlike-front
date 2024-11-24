"use server";

import { WebtoonFormSchema } from "@/resources/webtoons/dtos/webtoon.dto";
import z from "zod";
import { action } from "@/handlers/safeAction";
import webtoonService from "@/resources/webtoons/services/webtoon.service";

// TODO 권한, 사용자 타입, 관리자 체크
export const createOrUpdateWebtoon = action
  .schema(WebtoonFormSchema)
  .metadata({ actionName: "createOrUpdateWebtoon" })
  .bindArgsSchemas([
    z.number().optional() // webtoonId
  ])
  .action(async ({
    parsedInput: formData,
    bindArgsParsedInputs: [webtoonId]
  }) => {
    if (webtoonId){
      await webtoonService.update(webtoonId, formData);
    } else {
      await webtoonService.create(formData);
    }
  });
