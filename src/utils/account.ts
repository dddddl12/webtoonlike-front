"use server";

import type { UserFormT } from "@backend/types/User";
import * as UserApi from "@/apis/users";
import { clerkClient } from "@clerk/nextjs/server";
import { AdminLevel, ClerkUserMetadata } from "@backend/types/Token";

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
