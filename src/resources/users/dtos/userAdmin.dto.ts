import { UserSchema } from "@/resources/users/dtos/user.dto";
import z from "zod";

export const AdminPageAccountSchema = UserSchema.pick({
  id: true,
  name: true,
  userType: true,
  createdAt: true,
});
export type AdminPageAccountT = z.infer<typeof AdminPageAccountSchema>;

export const NonAdminUserSearchSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  userType: true
});
export type NonAdminUserSearchT = z.infer<typeof NonAdminUserSearchSchema>;
