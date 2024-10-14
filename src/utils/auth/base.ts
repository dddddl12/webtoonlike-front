import type { AdminLevel, ClerkUserMetadata, UserTypeT } from "@backend/types/User";

export type UserInfo = {
    id: number;
    type: UserTypeT | "guest";
    adminLevel: AdminLevel;
}

export const getUserInfo = (clerkUserMetadata?: ClerkUserMetadata): UserInfo => {
  if(clerkUserMetadata) {
    // TODO validation 포함 후 맞지 않으면 강제 로그아웃
    return {
      id: clerkUserMetadata.webtoonLikeId,
      type: clerkUserMetadata.type,
      adminLevel: clerkUserMetadata.adminLevel,
    };
  } else {
    return {
      id: -1,
      type: "guest",
      adminLevel: 0
    };
  }
};