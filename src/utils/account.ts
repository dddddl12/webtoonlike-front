"use server";

import { clerkClient } from "@clerk/nextjs/server";

// TODO 유저 정보 업데이트 확인
export const createUser = async (form: UserFormT) => {
  const user = await UserApi.createMe(form);
  const metadata: ClerkUserMetadata = {
    webtoonLikeId: user.id,
    type: user.userType,
    adminLevel: AdminLevel.None
  };
  await clerkClient.users.updateUserMetadata(user.sub, {
    publicMetadata: metadata,
  });
};
