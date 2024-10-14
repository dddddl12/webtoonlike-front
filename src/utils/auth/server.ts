import { auth } from "@clerk/nextjs/server";
import { getUserInfo, UserInfo } from "@/utils/auth/base";
import { ClerkUserMetadata } from "@backend/types/User";

export const getServerUserInfo = (): UserInfo => {
  const authedUser = auth();
  const metadata = authedUser.userId
    ? authedUser.sessionClaims.metadata as ClerkUserMetadata
    : undefined;
  return getUserInfo(metadata);
};
