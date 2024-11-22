"use server";

import { GenreFormSchema, GenreSchema } from "@/resources/genres/genre.types";
import z from "zod";
import { action } from "@/handlers/safeAction";
import genreService from "@/resources/genres/genre.service";

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
  .action(genreService.list);

export const createOrUpdateGenre = action
  .metadata({ actionName: "createOrUpdateGenre" })
  .schema(GenreFormSchema)
  .bindArgsSchemas([
    z.number().optional() // genreId
  ])
  .action(async ({
    bindArgsParsedInputs: [genreId],
    parsedInput: formData,
  }) => {
    if (genreId !== undefined) {
      return genreService.update(genreId, formData);
    } else {
      return genreService.create(formData);
    }
  });

export const deleteGenre = action
  .metadata({ actionName: "deleteGenre" })
  .bindArgsSchemas([
    z.number() // genreId
  ])
  .action(async ({
    bindArgsParsedInputs: [genreId],
  }) => {
    return genreService.delete(genreId);
  });
