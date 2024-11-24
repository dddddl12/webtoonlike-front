import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { UserSchema } from "@/resources/users/dtos/user.dto";

export const AdminBaseSchema = z.object({
  isSuper: z.boolean(),
});

export const AdminSchema = AdminBaseSchema
  .merge(ResourceSchema);

export const AdminEntrySchema = AdminSchema.extend({
  user: UserSchema.pick({
    name: true,
    email: true,
    userType: true
  }),
  isDeletable: z.boolean()
});
export type AdminEntryT = z.infer<typeof AdminEntrySchema>;
