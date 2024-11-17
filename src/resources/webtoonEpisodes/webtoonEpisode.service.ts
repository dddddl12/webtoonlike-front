"use server";

import prisma from "@/utils/prisma";
import {
  WebtoonEpisodeFormSchema,
  WebtoonEpisodeFormT,
  WebtoonEpisodeSchema
} from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { AdminLevel } from "@/resources/tokens/token.types";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/user.types";
import z from "zod";
import { action } from "@/handlers/safeAction";
import { Prisma } from "@prisma/client";


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
export const getEpisode = action
  .metadata({ actionName: "getEpisode" })
  .bindArgsSchemas([
    z.number() // episodeId
  ])
  .outputSchema(WebtoonEpisodeDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [episodeId],
  }) => {
    const { userId, metadata } = await getTokenInfo();
    const record = await prisma.webtoonEpisode.findUniqueOrThrow({
      where: { id: episodeId },
      include: {
        webtoon: {
          select: {
            id: true,
            userId: true,
            title: true,
            title_en: true,
            episodes: {
              select: {
                id: true,
                episodeNo: true,
              },
              orderBy: {
                episodeNo: "asc"
              }
            }
          }
        }
      }
    });

    const episodeIds = record.webtoon.episodes
      .map(e => e.id);
    const navigation = {
      nextId: episodeIds[episodeIds.indexOf(episodeId) + 1],
      previousId: episodeIds[episodeIds.indexOf(episodeId) - 1],
    };

    return {
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      webtoonId: record.webtoonId,
      episodeNo: record.episodeNo,
      englishUrl: record.englishUrl ?? undefined,
      imagePaths: record.imagePaths as string[],
      isEditable: metadata.type === UserTypeT.Creator
      && (record.webtoon.userId === userId || metadata.adminLevel >= AdminLevel.Admin),
      webtoon: {
        id: record.webtoon.id,
        title: record.webtoon.title,
        title_en: record.webtoon.title_en ?? undefined,
      },
      navigation
    };
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
      await updateEpisode(webtoonId, episodeId, formData);
    } else {
      await createEpisode(webtoonId, formData);
    }
  });

async function createEpisode(webtoonId: number, form: WebtoonEpisodeFormT) {
  const insertData: Prisma.WebtoonEpisodeCreateInput = {
    ...form,
    webtoon: {
      connect: {
        id: webtoonId
      }
    }
  };
  await prisma.$transaction(async (tx) => {
    await tx.webtoonEpisode.create({
      data: insertData
    });
  });
}

async function updateEpisode(webtoonId: number, episodeId: number, form: WebtoonEpisodeFormT) {
  await prisma.$transaction(async (tx) => {
    await tx.webtoonEpisode.update({
      data: form,
      where: {
        id: episodeId,
        webtoonId
      }
    });
  });
}
