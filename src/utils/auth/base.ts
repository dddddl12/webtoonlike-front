import { ClerkUserMetadataSchema } from "@backend/types/Token";
import z from "zod";

const UserInfoSchema = z.object({
  id: ClerkUserMetadataSchema.shape.webtoonLikeId,
  type: ClerkUserMetadataSchema.shape.type.optional(),
  // 로그인을 안한 경우 type 없음
  adminLevel: ClerkUserMetadataSchema.shape.adminLevel,
});
export type UserInfo = z.infer<typeof UserInfoSchema>;

export const getUserInfo = (
  metadataBeforeVerified: any
): UserInfo => {
  const { data: metadata, success } = ClerkUserMetadataSchema.safeParse(metadataBeforeVerified);
  if (success) {
    return {
      id: metadata.webtoonLikeId,
      type: metadata.type,
      adminLevel: metadata.adminLevel,
    };
  } else {
    return {
      id: -1,
      adminLevel: 0
    };
  }
};