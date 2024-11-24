// 저작권자 또는 바이어 정보 포함
import z from "zod";
import { UserFormSchema, UserTypeT } from "@/resources/users/dtos/user.dto";
import { CreatorFormSchema } from "@/resources/creators/creator.dto";
import { BuyerFormSchema } from "@/resources/buyers/buyer.dto";

export enum SignUpStage {
  Begin = 0,
  FillUserInfo = 1,
  FillRoleInfo = 2,
  Finished = 3,
}

export const UserAccountWithCreatorFormSchema = UserFormSchema.extend({
  userType: z.literal(UserTypeT.Creator),
  creator: CreatorFormSchema
});
export type UserAccountWithCreatorFormT = z.infer<typeof UserAccountWithCreatorFormSchema>;

export const UserAccountWithBuyerFormSchema = UserFormSchema.extend({
  userType: z.literal(UserTypeT.Buyer),
  buyer: BuyerFormSchema
});
export type UserAccountWithBuyerFormT = z.infer<typeof UserAccountWithBuyerFormSchema>;

export const UserAccountFormSchema = z.discriminatedUnion("userType", [
  UserAccountWithCreatorFormSchema,
  UserAccountWithBuyerFormSchema
]);
export type UserAccountFormT = z.infer<typeof UserAccountFormSchema>;