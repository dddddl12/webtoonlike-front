import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";

export enum UserTypeT {
  Creator = "CREATOR",
  Buyer = "BUYER"
}
export const CountrySchema = z.enum([
  "all",
  "ko",
  "en",
  "zhCN",
  "zhTW",
  "ja",
  "fr",
  "es",
  "vi",
  "ms",
  "th",
]);
// TODO lang code -> country code로 수정

const UserBaseSchema = z.object({
  // phone: z.string().regex(/^01[0-9]{9}$/),
  phone: z.string(),
  userType: z.nativeEnum(UserTypeT),
  country: CountrySchema,
  // postcode: z.string().regex(/^[0-9]{5}$/),
  postcode: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
});

export const UserFormSchema = UserBaseSchema.extend({
  agreed: z.literal(true)
});
export type UserFormT = z.infer<typeof UserFormSchema>

export const UserSchema = UserBaseSchema
  .merge(ResourceSchema)
  .extend({
    email: z.string(),
    sub: z.string(),
  });
export type UserT = z.infer<typeof UserSchema>;