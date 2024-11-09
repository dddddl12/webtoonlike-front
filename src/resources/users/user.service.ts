"use server";

import { UserExtendedFormSchema, UserExtendedFormT, UserTypeT } from "@/resources/users/user.types";
import prisma from "@/utils/prisma";
import { updateTokenInfo } from "@/resources/tokens/token.service";
import { currentUser } from "@clerk/nextjs/server";
import { NotSignedInError } from "@/errors";

export async function createUser(form: UserExtendedFormT) {
  // TODO 400 에러 처리
  form = UserExtendedFormSchema.parse(form);
  // 저작권자/바이어까지 등록 후 생성으로 구조 변경
  await prisma.$transaction(async (tx) => {
    const user = await currentUser();
    if (!user) {
      throw new NotSignedInError();
    }
    // 기본 유저 생성
    const insert = {
      sub: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: form.name,
      phone: form.phone,
      userType: form.userType,
      country: form.country,
      postcode: form.postcode,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2,
    };
    const { id: userId } = await tx.user.upsert({
      create: insert,
      update: insert,
      where: {
        sub: user.id
      },
      select: {
        id: true
      }
    });

    // 저작권자 생성
    if (form.userType === UserTypeT.Creator) {
      const { creator } = form;
      const insert = {
        ...creator,
        userId
      };

      await tx.creator.upsert({
        create: insert,
        update: insert,
        where: {
          userId
        }
      });

    // 바이어 생성
    } else if (form.userType === UserTypeT.Buyer) {
      const { buyer } = form;
      const insert = {
        ...buyer,
        userId
      };
      await tx.buyer.upsert({
        create: insert,
        update: insert,
        where: {
          userId
        }
      });
    }

    await updateTokenInfo(tx);
  });
}
