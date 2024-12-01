"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import { ListResponse, ListResponseSchema, PaginationSchema } from "@/resources/globalTypes";
import { AdminEntrySchema, AdminEntryT } from "@/resources/admins/admin.dto";
import adminService from "@/resources/admins/admin.service";

export const listAdmins = action
  .metadata({ actionName: "listAdmins" })
  .schema(PaginationSchema)
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
