import { Injectable } from "@nestjs/common";
import { createSignedUrl, putDevPrefix } from "@/utils/s3";
import { webtoonEpisodeM } from "@/models/webtoonEpisodes";
import { webtoonEpisodeImageM } from "@/models/webtoonEpisodeImages";
import { knex } from "@/global/db";
import * as mime from "mime-types";
import * as err from "@/errors";
import type {
  WebtoonEpisodeFormT, WebtoonEpisodeT,
  GetWebtoonEpisodeOptionT, ListWebtoonEpisodeOptionT,
} from "@/types/webtoonEpisodes";
import { lookupBuilder } from "./fncs/lookup_builder";
import { listWebtoonEpisode } from "./fncs/list_webtoon_episodes";
import type { WebtoonEpisodeImageFormT } from "@/types/webtoonEpisodeImages";


@Injectable()
export class WebtoonEpisodeService {
  constructor() {}

  async create(
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

  async update(
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

  async list(listOpt: ListWebtoonEpisodeOptionT = {}): Promise<ListData<WebtoonEpisodeT>> {
    return await listWebtoonEpisode(listOpt);
  }

  async get(id: idT, getOpt: GetWebtoonEpisodeOptionT = {}): Promise<WebtoonEpisodeT> {
    return webtoonEpisodeM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    });
  }


  async getThumbnailPresignedUrl(mimeType: string) {
    let key = `webtoon_episodes/thumbnails/thumbnail_${new Date().getTime()}.${mime.extension(mimeType)}`;
    key = putDevPrefix(key);
    const putUrl = await createSignedUrl(key, mimeType);
    return { putUrl, key };
  }
}