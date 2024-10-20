import { auth } from "@clerk/nextjs/server";
import { getUserInfo, UserInfo } from "@/utils/auth/base";

export const getServerUserInfo = (): UserInfo => {
  const clerkUser = auth();
  const metadata = clerkUser.userId
    ? clerkUser.sessionClaims.metadata
    : undefined;
  return getUserInfo(metadata);
};
