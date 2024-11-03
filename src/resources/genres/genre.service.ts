"use server";

import { GenreT } from "@/resources/genres/genre.types";
import prisma from "@/utils/prisma";
import { Prisma, Genre as GenreRecord } from "@prisma/client";

const mapToGenreDTO = (record: GenreRecord): GenreT => ({
  id: record.id,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  label: record.label,
  label_en: record.label_en ?? undefined,
  rank: record.rank ?? undefined
});

export async function listGenres(): Promise<GenreT[]> {
  return prisma.genre.findMany({
    orderBy: {
      rank: "asc",
    },
  }).then(records => records.map(mapToGenreDTO));
}

// export async function createGenre(form: GenreFormT): Promise<GenreT> {
//   const created = await genreM.create(form);
//   if (!created) {
//     throw new err.NotAppliedE();
//   }
//   return created;
// }
//
// export async function updateGenre(id: number, form: Partial<GenreFormT>): Promise<GenreT> {
//   const updated = await genreM.updateOne({ id }, form);
//   if (!updated) {
//     throw new err.NotAppliedE();
//   }
//   return updated;
// }
//
// export async function removeGenre(id: number): Promise<GenreT> {
//   const removed = await genreM.deleteOne({ id });
//   if (!removed) {
//     throw new err.NotAppliedE();
//   }
//   return removed;
// }
//

