import "server-only";
// 클라이언트에서 접근을 절대 불허할 것
import { PrismaTransaction } from "@/resources/globalTypes";
import { AdminLevel, TokenInfo, TokenInfoSchema } from "@/resources/tokens/token.types";
import prisma from "@/utils/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserTypeT } from "@/resources/users/user.types";
import { NotSignedInError } from "@/errors";
import { User } from "@clerk/backend";

export const getClerkUser = async () => {
  const clerkUser = await auth();
  if (!clerkUser.userId) {
    throw new NotSignedInError();
  }
  return clerkUser;
};

export const getTokenInfo = async (): Promise<TokenInfo> => {
  const clerkUser = await getClerkUser();
  return TokenInfoSchema.parse(clerkUser.sessionClaims.serviceInfo);
};

export async function updateTokenInfo(tx?: PrismaTransaction): Promise<{
  signUpFinished: boolean;
}> {
  const prismaClient = tx || prisma;
  const { userId: clerkUserId } = await getClerkUser();
  const user = await prismaClient.user.findUnique({
    where: {
      sub: clerkUserId
    },
    select: {
      id: true,
      userType: true,
      name: true,
      creator: {
        select: {
          id: true,
        }
      },
      buyer: {
        select: {
          id: true,
        }
      },
      admin: {
        select: {
          id: true,
          isSuper: true,
        }
      }
    },
  });

  if (!user
    || (user.userType == UserTypeT.Creator && !user.creator)
    || (user.userType == UserTypeT.Buyer && !user.buyer)) {
    return { signUpFinished: false };
  }
  // 토큰 업데이트
  const clerkUserMetadata: TokenInfo["metadata"] = {
    type: user.userType as UserTypeT,
    adminLevel: getAdminLevel(user.admin),
  };
  await clerkClient().then(client =>
    client.users.updateUser(clerkUserId, {
      firstName: user.name,
      lastName: "",
      externalId: user.id.toString(),
      publicMetadata: clerkUserMetadata
    }));
  return { signUpFinished: true };
}

const getAdminLevel = (admin: {
  id: number;
  isSuper: boolean;
} | null) => {
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
    if (externalId) {
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