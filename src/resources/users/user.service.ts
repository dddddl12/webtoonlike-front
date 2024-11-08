"use server";

import { UserFormT } from "@/resources/users/user.types";
import prisma from "@/utils/prisma";
import { getClerkUser, updateTokenInfo } from "@/resources/tokens/token.service";
import { currentUser } from "@clerk/nextjs/server";
import { NotSignedInError } from "@/errors";

export async function createUser(form: UserFormT) {
  // 저작권자/바이어까지 등록 후 생성으로 구조 변경
  await prisma.$transaction(async (tx) => {
    const user = await currentUser();
    if(!user) {
      throw new NotSignedInError();
    }
    // 레코드 추가
    const insert = {
      ...form,
      email: user.emailAddresses[0].emailAddress,
      sub: user.id,
      agreed: undefined
    };
    await tx.user.upsert({
      create: insert,
      update: insert,
      where: {
        sub: user.id
      }
    });
    await updateTokenInfo(tx);
  });
}
