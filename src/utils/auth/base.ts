import z from "zod";
import { UserTypeT } from "@/resources/users/user.types";

export enum AdminLevel {
  None = 0,
  Admin = 1,
  SuperAdmin = 2,
}

export const ClerkUserMetadataSchema = z.object({
  id: z.number(),
  type: z.nativeEnum(UserTypeT),
  adminLevel: z.nativeEnum(AdminLevel),
  signUpComplete: z.boolean().default(false),
});

export type ClerkUserMetadata = z.infer<typeof ClerkUserMetadataSchema>;
