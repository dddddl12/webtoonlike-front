import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { genreM } from "@/models/genres";
import type { GenreFormT, GenreT, GetGenreOptionT } from "@/types";

@Injectable()
export class GenreService {
  constructor() {}

  async get(id: idT, getOpt: GetGenreOptionT = {}): Promise<GenreT> {
    const fetched = await genreM.findOne({ id });
    if (!fetched) {
      throw new err.NotExistE(`genre with id ${id} not found`);
    }
    return fetched;
  }

  async list(): Promise<ListData<GenreT>> {
    const fetched = await genreM.find({
      builder: (qb) => {
        qb.orderBy("rank", "ASC NULLS LAST");
      }
    });
    return { data: fetched, nextCursor: null };
  }

  async create(form: GenreFormT): Promise<GenreT> {
    const created = await genreM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<GenreFormT>): Promise<GenreT> {
    const updated = await genreM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async remove(id: idT): Promise<GenreT> {
    const removed = await genreM.deleteOne({ id });
    if (!removed) {
      throw new err.NotAppliedE();
    }
    return removed;
  }


}