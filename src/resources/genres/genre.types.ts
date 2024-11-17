import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

const GenreBaseSchema = z.object({
  label: z.string().min(1),
  label_en: z.string().optional(),
  rank: z.number().optional(),
});

export const GenreFormSchema = GenreBaseSchema;
export type GenreFormT = z.infer<typeof GenreFormSchema>;

export const GenreSchema = GenreBaseSchema
  .merge(ResourceSchema);
