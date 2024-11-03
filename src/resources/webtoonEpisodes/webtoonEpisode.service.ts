"use server";

import { WebtoonEpisode as WebtoonEpisodeRecord } from "@prisma/client";
import prisma from "@/utils/prisma";
import { WebtoonEpisodeExtendedT, WebtoonEpisodeT } from "@/resources/webtoonEpisodes/webtoonEpisode.types";

const mapToWebtoonEpisodeDTO = (record: WebtoonEpisodeRecord): WebtoonEpisodeT => ({
  id: record.id,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  webtoonId: record.webtoonId,
  episodeNo: record.episodeNo,
  title: record.title ?? undefined,
  title_en: record.title_en ?? undefined,
  description: record.description ?? undefined,
  englishUrl: record.englishUrl ?? undefined,
});

export async function getEpisode(id: number): Promise<WebtoonEpisodeExtendedT> {

  const record = await prisma.webtoonEpisode.findUniqueOrThrow({
    where: { id },
    include: {
      images: true,
      webtoon: {
        select: {
          id: true,
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
    webtoon: {
      id: record.webtoon.id,
      title: record.webtoon.title,
      title_en: record.webtoon.title_en ?? undefined,
    },
    images: record.images.map(image => ({
      id: image.id,
      path: image.path
    })),
    navigation
  };
}

// export async function getThumbnailPresignedUrl(mimeType: string) {
//   let key = `webtoon_episodes/thumbnails/thumbnail_${new Date().getTime()}.${mime.extension(mimeType)}`;
//   key = putDevPrefix(key);
//   const putUrl = await createSignedUrl(key, mimeType);
//   return { putUrl, key };
// }
