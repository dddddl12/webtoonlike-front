import z from "zod";
import { UserTypeT } from "@/resources/users/user.types";
import { useUser } from "@clerk/nextjs";

export enum AdminLevel {
  None = 0,
  Admin = 1,
  SuperAdmin = 2,
}

// TODO parsing 실패 시 로그아웃 로직
export const ClerkUserMetadataSchema = z.object({
  id: z.number(),
  type: z.nativeEnum(UserTypeT),
  adminLevel: z.nativeEnum(AdminLevel),
  signUpComplete: z.boolean().default(false),
});

export type ClerkUserMetadata = z.infer<typeof ClerkUserMetadataSchema>;
