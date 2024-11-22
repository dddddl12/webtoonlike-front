"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import { ListResponse, ListResponseSchema } from "@/resources/globalTypes";
import { AdminSchema } from "@/resources/admins/admin.types";
import { UserSchema } from "@/resources/users/user.types";
import adminService from "@/resources/admins/admin.service";

const AdminEntrySchema = AdminSchema.pick({
  id: true,
  isSuper: true,
  createdAt: true,
}).extend({
  user: UserSchema.pick({
    name: true,
    email: true,
    userType: true
  }),
  isDeletable: z.boolean()
});
export type AdminEntryT = z.infer<typeof AdminEntrySchema>;
export const listAdmins = action
  .metadata({ actionName: "listAdmins" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  // todo 정적 분석을 하지 않음
  .outputSchema(
    ListResponseSchema(AdminEntrySchema)
  )
  .action(
    async ({ parsedInput }): Promise<ListResponse<AdminEntryT>> => {
      return adminService.list(parsedInput);
    });

export const createAdmin = action
  .metadata({ actionName: "createAdmin" })
  .schema(z.object({
    targetUserId: z.number()
  }))
  .action(async ({ parsedInput }) => {
    return adminService.create(parsedInput);
  });


export const deleteAdmin = action
  .metadata({ actionName: "deleteAdmin" })
  .bindArgsSchemas([
    z.number() // adminId
  ])
  .action(async ({
    bindArgsParsedInputs: [adminId],
  }) => {
    return adminService.delete(adminId);
  });
