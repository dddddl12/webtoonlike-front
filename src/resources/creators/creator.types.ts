import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

const CreatorBaseSchema = z.object({
  name: z.string().min(1),
  name_en: z.string().optional(),
  thumbPath: z.string().optional(),
  isAgencyAffiliated: z.boolean(),
  isExperienced: z.boolean(),
});

export const CreatorFormSchema = CreatorBaseSchema;

export const CreatorSchema = CreatorBaseSchema
  .merge(ResourceSchema)
  .extend({
    isExposed: z.boolean(),
  });
