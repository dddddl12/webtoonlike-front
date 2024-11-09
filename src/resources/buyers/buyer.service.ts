"use server";

import { BuyerFormT } from "@/resources/buyers/buyer.types";
import prisma from "@/utils/prisma";
import { getClerkUser, updateTokenInfo } from "@/resources/tokens/token.service";

export async function createBuyer(form: BuyerFormT ) {
  await prisma.$transaction(async (tx) => {
    const clerkUser = await getClerkUser();
    const { id: userId } = await tx.user.findUniqueOrThrow({
      select: {
        id: true
      },
      where: {
        sub: clerkUser.userId
      }
    });

    // 레코드 추가
    const insert = {
      ...form,
      userId
    };

    await tx.buyer.upsert({
      create: insert,
      update: insert,
      where: {
        userId
      }
    });

    await updateTokenInfo(tx);
  });
}
