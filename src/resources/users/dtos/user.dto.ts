import z from "zod";
import { CountrySchema, ResourceSchema } from "@/resources/globalTypes";
import { CreatorFormSchema } from "@/resources/creators/creator.dto";
import { BuyerFormSchema } from "@/resources/buyers/buyer.dto";

export enum UserTypeT {
  Creator = "CREATOR",
  Buyer = "BUYER"
}

const UserBaseSchema = z.object({
  name: z.string().min(1, "required").max(255),
  phone: z.string().min(1, "required")
    .regex(/^[+\-\d\s]+$/, "invalidPhoneFormat"),
  userType: z.nativeEnum(UserTypeT),
  country: CountrySchema.exclude(["ALL"]),
  postcode: z.string().min(1, "required"),
  addressLine1: z.string().min(1, "required"),
  addressLine2: z.string().min(1, "required"),
});

export const UserFormSchema = UserBaseSchema;
export type UserFormT = z.infer<typeof UserFormSchema>;

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

export const UserSchema = UserBaseSchema
  .merge(ResourceSchema)
  .extend({
    email: z.string(),
    sub: z.string(),
  });

