"use server";

import { WebtoonEpisodeT } from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { WebtoonEpisode as WebtoonEpisodeRecord } from "@prisma/client";
import prisma from "@/utils/prisma";

const mapToDTO = (record: WebtoonEpisodeRecord): WebtoonEpisodeT => ({
  ...record,
});


export async function createEpisode(
  form: WebtoonEpisodeFormT,
  relations?: {images?: WebtoonEpisodeImageFormT[]},
): Promise<WebtoonEpisodeT> {
  let created: WebtoonEpisodeT|null = null;
  await knex.transaction(async (trx) => {
    created = await webtoonEpisodeM.create(form, { trx });

    if (relations?.images) {
      const imageForms = relations.images.map((form, idx) => {
        form.episodeId = created!.id;
        form.rank = idx;
        return form;
      });
      await webtoonEpisodeImageM.createMany(imageForms, { trx });
    }
  });

  if (!created) {
    throw new err.NotAppliedE();
  }
  return created;
}

export async function updateEpisode(
  id: idT,
  form: Partial<WebtoonEpisodeFormT>,
  relations?: {images?: WebtoonEpisodeImageFormT[]},
): Promise<WebtoonEpisodeT> {
  let updated: WebtoonEpisodeT|null = null;
  await knex.transaction(async (trx) => {
    updated = await webtoonEpisodeM.updateOne({ id }, form, { trx });

    if (relations?.images) {
      await webtoonEpisodeImageM.deleteMany({ episodeId: id }, { trx });
      const imageForms = relations.images.map((form, idx) => {
        form.episodeId = updated!.id;
        form.rank = idx;
        return form;
      });
      await webtoonEpisodeImageM.createMany(imageForms, { trx });
    }
  });
  if (!updated) {
    throw new err.NotAppliedE();
  }
  return updated;
}

export async function listEpisodes(webtoonId: number): Promise<{
  items: WebtoonEpisodeT[]
}> {
  const records = await prisma.webtoonEpisode.findMany({
    where: { webtoonId },
  });
  return {
    items: records.map(mapToDTO)
  };
}

export async function getEpisode(id: number) {
  return prisma.webtoonEpisode.findUniqueOrThrow({
    where: { id },
  }).then(mapToDTO);
}

export async function getEpisodeWidthWebtoonInfo(id: number) {
  return prisma.webtoonEpisode.findUniqueOrThrow({
    where: { id },
    include: {
      webtoon: {
        select: {
          id: true,
          title: true,
          title_en: true,
          authorId: true
        },
      },
      WebtoonEpisodeImage: true
    }
  });
}


export async function getThumbnailPresignedUrl(mimeType: string) {
  let key = `webtoon_episodes/thumbnails/thumbnail_${new Date().getTime()}.${mime.extension(mimeType)}`;
  key = putDevPrefix(key);
  const putUrl = await createSignedUrl(key, mimeType);
  return { putUrl, key };
}
