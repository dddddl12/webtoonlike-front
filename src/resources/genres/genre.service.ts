"use server";

import { GenreFormT, GenreSchema } from "@/resources/genres/genre.types";
import prisma from "@/utils/prisma";
import { assertAdmin } from "@/resources/tokens/token.service";
import z from "zod";
import { Prisma } from "@prisma/client";

const BasicGenreSchema = GenreSchema.pick({
  id: true,
  label: true,
  label_en: true,
  rank: true
});
export type BasicGenreT = z.infer<typeof BasicGenreSchema>;
export async function listGenres(): Promise<BasicGenreT[]> {
  const records = await prisma.genre.findMany({
    orderBy: {
      rank: "asc",
    },
  });
  return records.map(r=>({
    id: r.id,
    label: r.label,
    label_en: r.label_en ?? undefined,
    rank: r.rank ?? undefined
  }));
}

export async function createGenre(form: GenreFormT) {
  await assertAdmin();
  await prisma.genre.create({
    data: form,
  });
}

export async function updateGenre(genreId: number, form: GenreFormT) {
  await assertAdmin();
  await prisma.genre.update({
    data: form,
    where: {
      id: genreId,
    }
  });
}

export async function deleteGenre(genreId: number): Promise<{
  isSuccess: boolean;
}> {
  await assertAdmin();
  try {
    await prisma.genre.delete({
      where: {
        id: genreId,
      }
    });
    return {
      isSuccess: true,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return {
        isSuccess: false,
      };
    } else {
      throw e;
    }
  }
}
