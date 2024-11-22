import "server-only";
import type { WebtoonEpisodeEnglishUrlFormT, WebtoonEpisodeFormT } from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { Prisma } from "@prisma/client";
import prisma from "@/utils/prisma";
import { getTokenInfo } from "@/resources/tokens/token.controller";

export async function createEpisode(webtoonId: number, form: WebtoonEpisodeFormT) {
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

export async function updateEpisode(
  webtoonId: number,
  episodeId: number,
  form: WebtoonEpisodeFormT | WebtoonEpisodeEnglishUrlFormT
) {
  await prisma.$transaction(async (tx) => {
    await tx.webtoonEpisode.update({
      data: form,
      where: {
        id: episodeId,
        webtoonId
      },
      include: {
        webtoon: {
          select: {
            userId: true
          }
        }
      }
    });
  });
}
