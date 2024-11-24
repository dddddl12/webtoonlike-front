"use server";

import { SimpleUserProfileSchema } from "@/resources/users/dtos/user.dto";
import { action } from "@/handlers/safeAction";
import userService from "@/resources/users/services/user.service";

// /account
export const getSimpleUserProfile = action
  .metadata({ actionName: "getSimpleUserProfile" })
  .outputSchema(SimpleUserProfileSchema)
  .action(userService.getSimple);
