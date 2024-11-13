"use server";

import { WebtoonEpisode as WebtoonEpisodeRecord } from "@prisma/client";
import prisma from "@/utils/prisma";
import {
  WebtoonEpisodeExtendedT,
  WebtoonEpisodeFormT,
  WebtoonEpisodeT
} from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { AdminLevel } from "@/resources/tokens/token.types";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/user.types";

const mapToWebtoonEpisodeDTO = (record: WebtoonEpisodeRecord): WebtoonEpisodeT => ({
  id: record.id,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  webtoonId: record.webtoonId,
  episodeNo: record.episodeNo,
  englishUrl: record.englishUrl ?? undefined,
  imagePaths: record.imagePaths as string[]
});

export async function getEpisode(id: number): Promise<WebtoonEpisodeExtendedT> {
  const { userId, metadata } = await getTokenInfo();

  const record = await prisma.webtoonEpisode.findUniqueOrThrow({
    where: { id },
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
    nextId: episodeIds[episodeIds.indexOf(id) + 1],
    previousId: episodeIds[episodeIds.indexOf(id) - 1],
  };

  return {
    ...mapToWebtoonEpisodeDTO(record),
    isEditable: metadata.type === UserTypeT.Creator && record.webtoon.userId === userId,
    webtoon: {
      id: record.webtoon.id,
      title: record.webtoon.title,
      title_en: record.webtoon.title_en ?? undefined,
    },
    navigation
  };
}

export async function createEpisode(webtoonId: number, form: WebtoonEpisodeFormT) {
  await prisma.$transaction(async (tx) => {
    const { id } = await tx.webtoonEpisode.create({
      data: {
        webtoonId,
        ...form,
      },
      select: {
        id: true,
      }
    });
    return id;
  });
}

export async function updateEpisode(episodeId: number, form: WebtoonEpisodeFormT) {
  await prisma.$transaction(async (tx) => {
    await tx.webtoonEpisode.update({
      data: form,
      where: {
        id: episodeId,
      }
    });
  });
}
