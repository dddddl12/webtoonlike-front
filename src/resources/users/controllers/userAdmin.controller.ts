"use server";

// /admin/users
import { action } from "@/handlers/safeAction";
import z from "zod";
import { ListResponseSchema } from "@/resources/globalTypes";
import { AdminPageAccountSchema, NonAdminUserSearchSchema } from "@/resources/users/dtos/userAdmin.dto";
import userAdminService from "@/resources/users/services/userAdmin.service";

export const listUsers = action
  .metadata({ actionName: "listUsers" })
  .schema(z.object({
    page: z.number()
  }))
  .outputSchema(ListResponseSchema(AdminPageAccountSchema))
  .action(async ({ parsedInput }) => {
    return userAdminService.list(parsedInput);
  });

// /admin/admins
const NonAdminUserSearchQuerySchema = z.object({
  q: z.string()
});
export type NonAdminUserSearchQueryT = z.infer<typeof NonAdminUserSearchQuerySchema>;
export const searchNonAdminUsers = action
  .metadata({ actionName: "SearchNonAdminUsers" })
  .schema(NonAdminUserSearchQuerySchema)
  .outputSchema(z.array(NonAdminUserSearchSchema))
  .action(async ({ parsedInput }) => {
    return userAdminService.searchNonAdminUsers(parsedInput);
  });
