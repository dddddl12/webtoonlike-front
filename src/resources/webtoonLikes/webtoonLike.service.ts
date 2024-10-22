import { Injectable } from "@nestjs/common";
import { webtoonLikeM } from "@/models/webtoonLikes";
import * as err from "@/errors";
import type { WebtoonLikeT } from "@/types";

@Injectable()
export class WebtoonLikeService {
  constructor() {}

  // TODO 필요한지 확인
  async get(id: idT): Promise<WebtoonLikeT> {
    const webtoonLike = await webtoonLikeM.findOne({ id });
    if (!webtoonLike) {
      throw new err.NotExistE();
    }
    return webtoonLike;
  }

  async create(webtoonId: idT, userId: idT): Promise<void> {
    const created = await webtoonLikeM.upsert({ webtoonId, userId },
      { onConflict: ["userId", "webtoonId"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
  }

  async remove(webtoonId: idT, userId: idT): Promise<void> {
    const deleted = await webtoonLikeM.deleteOne({ webtoonId, userId });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
  }
}