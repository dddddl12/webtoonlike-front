"use server";

import { GenreFormSchema, GenreSchema } from "@/resources/genres/genre.types";
import prisma from "@/utils/prisma";
import { assertAdmin } from "@/resources/tokens/token.service";
import z from "zod";
import { Prisma } from "@prisma/client";
import { action } from "@/handlers/safeAction";
import { returnValidationErrors } from "next-safe-action";
import { ForeignKeyError } from "@/handlers/errors";

const BasicGenreSchema = GenreSchema.pick({
  id: true,
  label: true,
  label_en: true,
  rank: true
});
export type BasicGenreT = z.infer<typeof BasicGenreSchema>;
export const listGenres = action
  .metadata({ actionName: "listGenres" })
  .outputSchema(z.array(BasicGenreSchema))
  .action(async () => {
    const records = await prisma.genre.findMany({
      orderBy: [
        {
          rank: "asc"
        },
        {
          createdAt: "asc"
        }
      ],
    });
    return records.map(r=>({
      id: r.id,
      label: r.label,
      label_en: r.label_en ?? undefined,
      rank: r.rank ?? undefined
    }));
  });

export const createOrUpdateGenre = action
  .metadata({ actionName: "createOrUpdateGenre" })
  .schema(GenreFormSchema)
  .bindArgsSchemas([
    z.number().optional() // genreId
  ])
  .action(async ({
    parsedInput: formData,
    bindArgsParsedInputs: [genreId],
  }) => {
    await assertAdmin();
    const dbAction = genreId
      // genreId가 있으면 수정
      ? prisma.genre.update({
        data: formData,
        where: {
          id: genreId,
        }
      })
      // genreId가 없으면 생성
      : prisma.genre.create({
        data: formData,
      });
    await dbAction.catch(e => {
      // 중복 에러 처리
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        returnValidationErrors(
          GenreFormSchema,
          Object.fromEntries(((e.meta?.target || []) as string[])
            .map(name => [
              name, {
                _errors: ["duplicateValue"]
              }
            ])
          )
        );
      }
      throw e;
    });
  });

export const deleteGenre = action
  .metadata({ actionName: "deleteGenre" })
  .bindArgsSchemas([
    z.number().optional() // genreId
  ])
  .action(async ({
    bindArgsParsedInputs: [genreId],
  }) => {
    await assertAdmin();
    await prisma.genre.delete({
      where: {
        id: genreId,
      }
    }).catch(e => {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        throw new ForeignKeyError();
      }
      throw e;
    });
  });
