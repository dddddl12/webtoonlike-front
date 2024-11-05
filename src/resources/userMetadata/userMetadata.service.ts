import "server-only";
// 클라이언트에서 접근을 절대 불허할 것

import { PrismaTransaction } from "@/resources/globalTypes";
import {
  AdminLevel,
  BaseClerkUserMetadata,
  ClerkUserMetadata,
  ClerkUserMetadataSchema
} from "@/resources/userMetadata/userMetadata.types";
import prisma from "@/utils/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserTypeT } from "@/resources/users/user.types";
import type { Admin } from "@prisma/client";
import { NotSignedInError } from "@/errors";
import { User } from "@clerk/backend";

export const getClerkUser = async () => {
  const clerkUser = await auth();
  if (!clerkUser.userId) {
    throw new NotSignedInError();
  }
  return clerkUser;
};

export const getUserMetadata = async (): Promise<ClerkUserMetadata> => {
  const clerkUser = await getClerkUser();
  return ClerkUserMetadataSchema.parse(clerkUser.sessionClaims.metadata);
};

export async function updateUserMetadata(tx?: PrismaTransaction): Promise<BaseClerkUserMetadata | ClerkUserMetadata | undefined> {
  const { clerkUserId, metadata } = await getVerifiedUserMetadata(tx);
  await clerkClient().then(client =>
    client.users.updateUserMetadata(clerkUserId, {
      // TODO 키 클리어 이슈
      publicMetadata: metadata || {}
    }));
  return metadata;
}

async function getVerifiedUserMetadata(tx?: PrismaTransaction): Promise<{
  clerkUserId: string;
  metadata?: BaseClerkUserMetadata | ClerkUserMetadata;
}> {
  const prismaClient = tx || prisma;
  const { userId: clerkUserId } = await getClerkUser();
  const user = await prismaClient.user.findUnique({
    where: {
      sub: clerkUserId
    },
    include: {
      creator: true,
      buyer: true,
      admin: true,
    },
  });

  if (!user) {
    await clerkClient().then(client =>
      client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {}
      }));
    return { clerkUserId };
  }

  // 유저 정보 업데이트
  // TODO 즉각 변화되지 않음
  let clerkUserMetadata: BaseClerkUserMetadata | ClerkUserMetadata = {
    id: user.id,
    type: user.userType as UserTypeT,
    adminLevel: getAdminLevel(user.admin),
    signUpComplete: false
  };
  if (clerkUserMetadata.type == UserTypeT.Creator && user.creator) {
    clerkUserMetadata = {
      ...clerkUserMetadata,
      type: clerkUserMetadata.type,
      creatorId: user.creator.id,
      signUpComplete: true,
    };
  } else if (clerkUserMetadata.type == UserTypeT.Buyer && user.buyer) {
    clerkUserMetadata = {
      ...clerkUserMetadata,
      type: clerkUserMetadata.type,
      buyerId: user.buyer.id,
      signUpComplete: true,
    };
  }

  return {
    clerkUserId,
    metadata: clerkUserMetadata
  };
}

const getAdminLevel = (admin: Admin | null) => {
  if (!admin) {
    return AdminLevel.None;
  } else if (!admin.isSuper) {
    return AdminLevel.Admin;
  } else if (admin.isSuper) {
    return AdminLevel.SuperAdmin;
  }
  throw new Error("Unexpected admin level");
};

export const getClerkUserMap = async (userIds: number[]): Promise<Map<number, User>> => {
  const userIdsSet = new Set(userIds);
  const clerkUsers = await clerkClient().then(client =>
    client.users.getUserList({
      externalId: [...userIdsSet].map(id => id.toString())
    }));
  const map = new Map<number, User>();
  clerkUsers.data.forEach(user => {
    const { externalId } = user;
    if(externalId) {
      map.set(parseInt(externalId), user);
    }
  });
  return map;
//   TODO 계정 탈퇴 시 남겨야 할 유저 정보
//   TODO 웹훅 검토
};

export const getClerkUserById = async (userId: number): Promise<User|undefined> => {
  const userMap = await getClerkUserMap([userId]);
  return userMap.get(userId);
};