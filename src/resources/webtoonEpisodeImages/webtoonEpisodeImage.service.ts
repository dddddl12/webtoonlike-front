import { Injectable } from "@nestjs/common";
import { webtoonEpisodeImageM } from "@/models/webtoonEpisodeImages";
import * as err from "@/errors";
import mime from "mime-types";
import { createSignedUrl, putDevPrefix } from "@/utils/s3";
import type {
  WebtoonEpisodeImageFormT, WebtoonEpisodeImageT,
  GetWebtoonEpisodeImageOptionT, ListWebtoonEpisodeImageOptionT,
} from "@/types/webtoonEpisodeImages";

@Injectable()
export class WebtoonEpisodeImageService {
  constructor() {}

  async create(form: WebtoonEpisodeImageFormT): Promise<WebtoonEpisodeImageT> {
    const created = await webtoonEpisodeImageM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListWebtoonEpisodeImageOptionT = {}): Promise<ListData<WebtoonEpisodeImageT>> {
    const opt = listOpt;

    const fetched = await webtoonEpisodeImageM.find({
      builder: (qb, select) => {
        if (opt.episodeId) {
          qb.where("episode_id", opt.episodeId);
          qb.orderBy("rank", "ASC");
        }
      }
    });
    return { data: fetched, nextCursor: null };
  }

  async get(id: idT, getOpt: GetWebtoonEpisodeImageOptionT): Promise<WebtoonEpisodeImageT> {
    const fetched = await webtoonEpisodeImageM.findOne({ id });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async remove(id: idT): Promise<WebtoonEpisodeImageT> {
    const deleted = await webtoonEpisodeImageM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async getPresignedUrl(mimeType: string) {
    let key = `webtoon_episode_images/images/image_${new Date().getTime()}.${mime.extension(mimeType)}`;
    key = putDevPrefix(key);
    const putUrl = await createSignedUrl(key, mimeType);
    return { putUrl, key };
  }
}