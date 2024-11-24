"use server";

import { action } from "@/handlers/safeAction";
import { UserAccountFormSchema, UserAccountFormT } from "@/resources/users/dtos/userAccount.dto";
import userAccountService from "@/resources/users/services/userAccount.service";

export const createUser = action
  .metadata({ actionName: "createUser" })
  .schema(UserAccountFormSchema)
  .action(async ({ parsedInput }) => {
    return userAccountService.create(parsedInput);
  });

// /account/update
export const getUser = action
  .metadata({ actionName: "getUser" })
  .outputSchema(UserAccountFormSchema)
  .action(async (): Promise<UserAccountFormT> => {
    return userAccountService.get();
  });
