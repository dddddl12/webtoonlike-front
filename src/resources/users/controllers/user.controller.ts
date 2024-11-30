"use server";

import { action } from "@/handlers/safeAction";
import {
  UserAccountFormSchema,
  UserAccountWithBuyerFormSchema,
  UserAccountWithCreatorFormSchema
} from "@/resources/users/dtos/user.dto";
import userService from "@/resources/users/services/user.service";

export const createCreatorUser = action
  .metadata({ actionName: "createCreatorUser" })
  .schema(UserAccountWithCreatorFormSchema)
  .action(async ({ parsedInput }) => {
    return userService.create(parsedInput);
  });

export const createBuyerUser = action
  .metadata({ actionName: "createBuyerUser" })
  .schema(UserAccountWithBuyerFormSchema)
  .action(async ({ parsedInput }) => {
    return userService.create(parsedInput);
  });

// /account/update
export const getUser = action
  .metadata({ actionName: "getUser" })
  .outputSchema(UserAccountFormSchema)
  .action(userService.get);

// /account
export const deleteUser = action
  .metadata({ actionName: "deleteUser" })
  .action(userService.delete);
