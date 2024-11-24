import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { UserSchema } from "@/resources/users/dtos/user.dto";

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

/* 저작권자 페이지 */
export const PublicCreatorSchema = z.object({
  thumbPath: z.string().optional(),
  localized: z.object({
    name: z.string()
  })
});
export type PublicCreatorT = z.infer<typeof PublicCreatorSchema>;

/* 관리자 > 저작권자 관리 페이지*/
export const AdminPageCreatorSchema = CreatorSchema.pick({
  id: true,
  name: true,
  isExposed: true,
}).extend({
  user: UserSchema.pick({
    name: true,
    createdAt: true
  })
});
export type AdminPageCreatorT = z.infer<typeof AdminPageCreatorSchema>;
