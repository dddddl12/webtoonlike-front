import z from "zod";
import { UserTypeT } from "@/resources/users/dtos/user.dto";

export enum AdminLevel {
  None = 0,
  Admin = 1,
  SuperAdmin = 2,
}

export const TokenInfoSchema = z.object({
  userId: z.string().transform(userId => parseInt(userId)),
  metadata: z.object({
    type: z.nativeEnum(UserTypeT),
    adminLevel: z.nativeEnum(AdminLevel),
  }),
});
export type TokenInfo = z.infer<typeof TokenInfoSchema>;

export type ClerkUser = {
  id: string;
  externalId: string;
  primaryEmail: string;
  fullName: string;
  imageUrl?: string;
};
