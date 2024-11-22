"use server";

import { action } from "@/handlers/safeAction";
import homeService from "@/resources/home/home.service";
import z from "zod";
import { HomeWebtoonItemSchema } from "@/resources/home/home.types";

export const homeItems = action
  .metadata({ actionName: "homeItems" })
  .action(homeService.getHomeItems);

const GenreFilterSchema = z.object({
  genreId: z.number()
});
export type GenreFilterT = z.infer<typeof GenreFilterSchema>;
export const getPerGenreItems = action
  .metadata({ actionName: "getPerGenreItems" })
  .schema(GenreFilterSchema)
  .outputSchema(z.array(HomeWebtoonItemSchema))
  .action(async ({ parsedInput }) => {
    return homeService.getPerGenreItems(parsedInput);
  });