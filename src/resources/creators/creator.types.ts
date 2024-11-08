import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { WebtoonPreviewSchema } from "@/resources/webtoons/webtoon.types";

const CreatorBaseSchema = z.object({
  name: z.string().min(1),
  name_en: z.string().optional(),
  thumbPath: z.string().optional(),
  isAgencyAffiliated: z.boolean(),
  isExperienced: z.boolean(),
  isExposed: z.boolean().default(false),
});

export const CreatorFormSchema = CreatorBaseSchema.extend({
  files: z.object({
    thumbnail: z.instanceof(File).optional(),
  })
});
export type CreatorFormT = z.infer<typeof CreatorFormSchema>;

export const CreatorSchema = CreatorBaseSchema
  .merge(ResourceSchema);
export type CreatorT = z.infer<typeof CreatorSchema>;

export const PublicCreatorSchema = z.object({
  name: z.string(),
  name_en: z.string().optional(),
  thumbPath: z.string().optional(),
});
export type PublicCreatorT = z.infer<typeof PublicCreatorSchema>;
