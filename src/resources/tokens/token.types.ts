import z from "zod";
import { UserTypeT } from "@/resources/users/user.types";

export enum SignUpStatus {
  NeedsBasicInfo = 0,
  NeedsCreatorInfo = 1,
  NeedsBuyerInfo = 2,
  Complete = 3,
}

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
