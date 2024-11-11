"use server";

import { UserExtendedFormSchema, UserExtendedFormT, UserFormT, UserTypeT } from "@/resources/users/user.types";
import prisma from "@/utils/prisma";
import { getTokenInfo, updateTokenInfo } from "@/resources/tokens/token.service";
import { currentUser } from "@clerk/nextjs/server";
import { NotSignedInError } from "@/errors";
import { BuyerCompanySchema, BuyerFormT } from "@/resources/buyers/buyer.types";

export async function createUser(form: UserExtendedFormT) {
  // TODO 400 에러 처리
  form = UserExtendedFormSchema.parse(form);
  // 저작권자/바이어까지 등록 후 생성으로 구조 변경
  await prisma.$transaction(async (tx) => {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!user || !userEmail) {
      throw new NotSignedInError();
    }
    // 기본 유저 생성
    const insert = {
      sub: user.id,
      email: userEmail,
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

export async function getUser(): Promise<UserExtendedFormT> {
  const { userId } = await getTokenInfo();
  const record = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    include: {
      buyer: true,
      creator: true
    }
  });
  const user: UserFormT = {
    name: record.name,
    phone: record.phone ?? undefined,
    userType: record.userType as UserTypeT,
    country: record.country as UserFormT["country"],
    postcode: record.postcode ?? "",
    addressLine1: record.addressLine1 ?? "",
    addressLine2: record.addressLine2 ?? "",
    agreed: true
  };
  if (record.userType === UserTypeT.Creator && record.creator) {
    const creatorRecord = record.creator;
    return {
      ...user,
      userType: UserTypeT.Creator,
      creator: {
        name: creatorRecord.name,
        name_en: creatorRecord.name_en ?? undefined,
        thumbPath: creatorRecord.thumbPath ?? undefined,
        isAgencyAffiliated: creatorRecord.isAgencyAffiliated,
        isExperienced: creatorRecord.isExperienced,
        isExposed: creatorRecord.isExposed
      }
    };
  } else if (record.userType === UserTypeT.Buyer && record.buyer) {
    const buyerRecord = record.buyer;
    return {
      ...user,
      userType: UserTypeT.Buyer,
      buyer: {
        company: BuyerCompanySchema.parse(buyerRecord.company),
        purpose: buyerRecord.purpose as BuyerFormT["purpose"] ?? undefined,
      }
    };
  }
  throw new Error("User not found");
}