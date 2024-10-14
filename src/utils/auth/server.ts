import { auth } from "@clerk/nextjs/server";
import { ClerkUserMetadata } from "@/types";
import { getUserInfo, UserInfo } from "@/utils/auth/base";

export const getServerUserInfo = (): UserInfo => {
  const authedUser = auth();
  const metadata = authedUser.userId
    ? authedUser.sessionClaims.metadata as ClerkUserMetadata
    : undefined;
  return getUserInfo(metadata);
};
