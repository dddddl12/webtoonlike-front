import "server-only";
// 클라이언트에서 접근을 절대 불허할 것
import { PrismaTransaction } from "@/resources/globalTypes";
import { AdminLevel, ClerkUser, TokenInfo, TokenInfoSchema } from "@/resources/tokens/token.types";
import prisma from "@/utils/prisma";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { UserTypeT } from "@/resources/users/user.types";
import { ForbiddenError, NotAuthorizedError } from "@/handlers/errors";
import { User } from "@clerk/backend";
import { getTranslations } from "next-intl/server";

// TODO 강제 로그인 또는 토큰 갱신 검토
export const notAuthorizedErrorWithMessage = async (): Promise<NotAuthorizedError> => {
  const t = await getTranslations("errors.NotAuthorizedError");
  return new NotAuthorizedError({
    title: t("title"),
    message: t("message")
  });
};

export const getClerkUser = async (): Promise<ClerkUser> => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw await notAuthorizedErrorWithMessage();
  }
  const { id, primaryEmailAddress, firstName, lastName, externalId, imageUrl } = clerkUser;
  if (!primaryEmailAddress) {
    throw await notAuthorizedErrorWithMessage();
  }
  return {
    id,
    externalId: externalId ?? "", //todo
    primaryEmail: primaryEmailAddress.emailAddress,
    fullName: [firstName, lastName].filter(Boolean).join(" "),
    imageUrl
  };
};

const getClerkAuth = async () => {
  const clerkUser = await auth();
  if (!clerkUser.userId) {
    throw await notAuthorizedErrorWithMessage();
  }
  return clerkUser;
};

export const getTokenInfo = async (): Promise<TokenInfo> => {
  const clerkUser = await getClerkAuth();
  return TokenInfoSchema.parse(clerkUser.sessionClaims.serviceInfo);
};

export async function updateTokenInfo(tx?: PrismaTransaction): Promise<{
  signUpFinished: boolean;
}> {
  const prismaClient = tx || prisma;
  const { userId: clerkUserId } = await getClerkAuth();
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

export const assertAdmin = async (params?: {
  needsSuperPermission: boolean;
}) => {
  const needsSuperPermission = params?.needsSuperPermission || false;
  const { metadata } = await getTokenInfo();
  if (needsSuperPermission && metadata.adminLevel < AdminLevel.SuperAdmin) {
    const t = await getTranslations("errors.ForbiddenError.adminLevel");
    throw new ForbiddenError({
      title: t("title"),
      message: t("superAdminMessage"),
      logError: true,
    });
  } else if (metadata.adminLevel < AdminLevel.Admin) {
    const t = await getTranslations("errors.ForbiddenError.adminLevel");
    throw new ForbiddenError({
      title: t("title"),
      message: t("message"),
      logError: true,
    });
  }
};

export const assertBuyer = async () => {
  const { metadata } = await getTokenInfo();
  if (metadata.type !== UserTypeT.Buyer) {
    const t = await getTranslations("errors.ForbiddenError.buyersOnly");
    throw new NotAuthorizedError({
      title: t("title"),
      message: t("message"),
      logError: true,
    });
  }
};

export const assertCreator = async () => {
  const { metadata } = await getTokenInfo();
  if (metadata.type !== UserTypeT.Creator) {
    const t = await getTranslations("errors.ForbiddenError.creatorsOnly");
    throw new NotAuthorizedError({
      title: t("title"),
      message: t("message"),
      logError: true,
    });
  }
};

export const getClerkUserMap = async (clerkUserIds: string[]): Promise<Map<string, User>> => {
  const clerkUserIdSet = new Set(clerkUserIds);
  const clerkUsers = await clerkClient().then(client =>
    client.users.getUserList({
      userId: [...clerkUserIdSet]
    }));
  const map = new Map<string, User>();
  clerkUsers.data.forEach(user => {
    map.set(user.id, user);
  });
  return map;
//   TODO 계정 탈퇴 시 남겨야 할 유저 정보
//   TODO 웹훅 검토
};
