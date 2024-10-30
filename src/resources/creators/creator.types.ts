import { UserT } from "@/resources/users/user.types";
import z from "zod";
import { Resource } from "@/resources/globalTypes";

const CreatorBaseSchema = z.object({
  name: z.string().min(1),
  name_en: z.string().optional(),
  thumbPath: z.string().optional(),
  isAgencyAffiliated: z.boolean(),
  isExperienced: z.boolean(),
  isExposed: z.boolean().default(false),
});

export const CreatorFormSchema = CreatorBaseSchema.extend({
  thumbnail: z.instanceof(File).optional(),
});

export type CreatorFormT = z.infer<typeof CreatorFormSchema>;

export type CreatorT = Resource<{
  user?: UserT;
  numWebtoon?: number;
  numWebtoonLike?: number;
}> & z.infer<typeof CreatorBaseSchema>