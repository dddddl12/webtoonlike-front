import { GenreT } from "@/resources/genres/genre.types";
import prisma from "@/utils/prisma";

export async function getGenre(id: number): Promise<GenreT> {
  const fetched = await genreM.findOne({ id });
  if (!fetched) {
    throw new err.NotExistE(`genre with id ${id} not found`);
  }
  return fetched;
}

export async function listGenres(): Promise<GenreT[]> {
  return prisma.genre.findMany({
    orderBy: {
      rank: "asc",
    },
  });
}

export async function createGenre(form: GenreFormT): Promise<GenreT> {
  const created = await genreM.create(form);
  if (!created) {
    throw new err.NotAppliedE();
  }
  return created;
}

export async function updateGenre(id: number, form: Partial<GenreFormT>): Promise<GenreT> {
  const updated = await genreM.updateOne({ id }, form);
  if (!updated) {
    throw new err.NotAppliedE();
  }
  return updated;
}

export async function removeGenre(id: number): Promise<GenreT> {
  const removed = await genreM.deleteOne({ id });
  if (!removed) {
    throw new err.NotAppliedE();
  }
  return removed;
}


