import z from "zod";
import { UserTypeT } from "@/resources/users/user.types";
import { useUser } from "@clerk/nextjs";

export enum AdminLevel {
  None = 0,
  Admin = 1,
  SuperAdmin = 2,
}

// 저작권자 또는 바이어 상세 정보 기입 이전 상태
const BaseClerkUserMetadataSchema = z.object({
  id: z.number(),
  type: z.nativeEnum(UserTypeT),
  adminLevel: z.nativeEnum(AdminLevel),
  signUpComplete: z.literal(false),
});
export type BaseClerkUserMetadata = z.infer<typeof BaseClerkUserMetadataSchema>;

// 둘 중 하나 타입으로 가입을 완료한 상태
const CreatorUserSchema = BaseClerkUserMetadataSchema.extend({
  type: z.literal(UserTypeT.Creator),
  creatorId: z.number(),
  signUpComplete: z.literal(true),
});
const BuyerUserSchema = BaseClerkUserMetadataSchema.extend({
  type: z.literal(UserTypeT.Buyer),
  buyerId: z.number(),
  signUpComplete: z.literal(true),
});
export const ClerkUserMetadataSchema = z.discriminatedUnion("type", [CreatorUserSchema, BuyerUserSchema]);
export type ClerkUserMetadata = z.infer<typeof ClerkUserMetadataSchema>;
