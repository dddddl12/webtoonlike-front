"use server";

import { GetUserOptionT, UserFormT, UserT, UserTypeT } from "@/resources/users/user.types";
import { getClerkUser } from "@/utils/auth/server";
import prisma from "@/utils/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { AdminLevel, ClerkUserMetadata } from "@/utils/auth/base";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/binary";
import { PrismaTransaction } from "@/resources/globalTypes";


export async function createUser(form: UserFormT) {
  await prisma.$transaction(async (tx) => {
    const { userId: clerkUserId } = await getClerkUser();
    // 레코드 추가
    const insert = {
      ...form,
      sub: clerkUserId,
      agreed: undefined
    };
    await tx.user.upsert({
      create: insert,
      update: insert,
      where: {
        sub: clerkUserId
      }
    });
    await updateClerkUser(tx);
  });
}

// async function getMe(id: number, getOpt: GetUserOptionT): Promise<UserT> {
//   return userM.findById(id, {
//     builder: (qb, select) => {
//       lookupBuilder(select, getOpt);
//     },
//   });
// }
//
// async function list(opt: ListUserOptionT): Promise<ListData<UserT>> {
//   return await listUser(opt);
// }
// async function listStats() {
//   return await listUsersStat();
// }
//
// async function deleteMe(id: number): Promise<UserT> {
//   const deleted = await userM.deleteOne({ id });
//   if (!deleted) {
//     throw new err.NotAppliedE();
//   }
//   return deleted;
// }

export async function updateClerkUser(tx: PrismaTransaction) {
  const { userId: clerkUserId } = await getClerkUser();
  const user = await tx.user.findUnique({
    where: {
      sub: clerkUserId
    },
    include: {
      Creator: true,
      Buyer: true,
      Admin: true,
    },
  });

  if (!user) {
    await clerkClient().then(client =>
      client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {}
      }));
  } else {
    const isSignUpComplete = !!((user.userType === UserTypeT.Creator && user.Creator)
      || (user.userType === UserTypeT.Buyer && user.Buyer));
    const clerkUserMetadata: ClerkUserMetadata = {
      id: user.id,
      type: user.userType === UserTypeT.Buyer ? UserTypeT.Buyer : UserTypeT.Creator,
      // TODO
      adminLevel: user.Admin
        ? (user.Admin.isSuper ? AdminLevel.SuperAdmin : AdminLevel.Admin)
        : AdminLevel.None,
      signUpComplete: isSignUpComplete,
    };
    await clerkClient().then(client =>
      client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: clerkUserMetadata
      }));
  }
}