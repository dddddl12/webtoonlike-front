import z from "zod";
import { CountrySchema, ResourceSchema } from "@/resources/globalTypes";
import { CreatorFormSchema } from "@/resources/creators/creator.types";
import { BuyerFormSchema } from "@/resources/buyers/buyer.types";

export enum SignUpStage {
  Begin = 0,
  FillUserInfo = 1,
  FillRoleInfo = 2,
  Finished = 3,
}

export enum UserTypeT {
  Creator = "CREATOR",
  Buyer = "BUYER"
}

const UserBaseSchema = z.object({
  // phone: z.string().regex(/^01[0-9]{9}$/),
  name: z.string().min(1).max(255),
  phone: z.string(),
  userType: z.nativeEnum(UserTypeT),
  country: CountrySchema.exclude(["ALL"]),
  // postcode: z.string().regex(/^[0-9]{5}$/),
  postcode: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
});

export const UserFormSchema = UserBaseSchema.extend({
  agreed: z.boolean().refine((agreed) => agreed, {
    message: "The user must agree to the terms of service."
  }),
});
export type UserFormT = z.infer<typeof UserFormSchema>;

// 저작권자 또는 바이어 정보 포함
export const UserExtendedFormSchema = z.discriminatedUnion("userType", [
  UserFormSchema.extend({
    userType: z.literal(UserTypeT.Creator),
    creator: CreatorFormSchema
  }),
  UserFormSchema.extend({
    userType: z.literal(UserTypeT.Buyer),
    buyer: BuyerFormSchema
  })
]);
export type UserExtendedFormT = z.infer<typeof UserExtendedFormSchema>;

export const UserSchema = UserBaseSchema
  .merge(ResourceSchema)
  .extend({
    email: z.string(),
    sub: z.string(),
  });
export type UserT = z.infer<typeof UserSchema>;