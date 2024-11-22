"use server";

import {
  UserExtendedFormSchema, UserExtendedFormT,
  UserSchema,
} from "@/resources/users/user.types";
import { ListResponseSchema } from "@/resources/globalTypes";
import z from "zod";
import { action } from "@/handlers/safeAction";
import userService from "@/resources/users/user.service";

// /sign-up-complete
export const createUser = action
  .metadata({ actionName: "createUser" })
  .schema(UserExtendedFormSchema)
  .action(async ({ parsedInput }) => {
    return userService.create(parsedInput);
  });

// /account
const SimpleUserProfileSchema = z.object({
  name: z.string(),
  thumbPath: z.string().optional()
});
export const getSimpleUserProfile = action
  .metadata({ actionName: "getSimpleUserProfile" })
  .outputSchema(SimpleUserProfileSchema)
  .action(userService.getSimple);

// /account/update
export const getUser = action
  .metadata({ actionName: "getUser" })
  .outputSchema(UserExtendedFormSchema)
  .action(async (): Promise<UserExtendedFormT> => {
    return userService.get();
  });

// /admin/users
const AdminPageAccountSchema = UserSchema.pick({
  id: true,
  name: true,
  userType: true,
  createdAt: true,
});
export type AdminPageAccountT = z.infer<typeof AdminPageAccountSchema>;
export const listUsers = action
  .metadata({ actionName: "listUsers" })
  .schema(z.object({
    page: z.number()
  }))
  .outputSchema(ListResponseSchema(AdminPageAccountSchema))
  .action(async ({ parsedInput }) => {
    return userService.list(parsedInput);
  });

// /admin/admins
const NonAdminUserSearchSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  userType: true
});
export type NonAdminUserSearchT = z.infer<typeof NonAdminUserSearchSchema>;
const NonAdminUserSearchQuerySchema = z.object({
  q: z.string()
});
export type NonAdminUserSearchQueryT = z.infer<typeof NonAdminUserSearchQuerySchema>;
export const searchNonAdminUsers = action
  .metadata({ actionName: "SearchNonAdminUsers" })
  .schema(NonAdminUserSearchQuerySchema)
  .outputSchema(z.array(NonAdminUserSearchSchema))
  .action(async ({ parsedInput }) => {
    return userService.searchNonAdminUsers(parsedInput);
  });
