import { Resource } from "@/resources/globalTypes";
import z from "zod";

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
  // postCode: z.string().regex(/^[0-9]{5}$/),
  postCode: z.string(),
  address: z.string(),
  addressDetail: z.string(),
});

export const UserFormSchema = UserBaseSchema.extend({
  agreed: z.literal(true)
});

export type UserFormT = z.infer<typeof UserFormSchema>

export type UserT = Resource<{
  // TODO 마이그레이션 완료 후 이메일 삭제
  email: string;
  sub: string;
}> & z.infer<typeof UserBaseSchema>;
