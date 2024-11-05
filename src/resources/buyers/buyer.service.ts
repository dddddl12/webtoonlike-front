"use server";

import { BuyerFormT } from "@/resources/buyers/buyer.types";
import prisma from "@/utils/prisma";
import { getClerkUser, updateTokenInfo } from "@/resources/tokens/token.service";

export async function createBuyer(form: BuyerFormT ) {
  // TODO
  const { thumbnail, businessCard, businessCert } = form.files;
  // if (thumbnail) {
  //   form.company.thumbPath = await uploadFile(thumbnail, "buyers/thumbnails");
  // }
  // if (businessCard) {
  //   form.company.businessCardPath = await uploadFile(businessCard, "buyers/business_cards");
  // }
  // if (businessCert) {
  //   form.company.businessCertPath = await uploadFile(businessCert, "buyers/business_certs");
  // }
  await prisma.$transaction(async (tx) => {
    const clerkUser = await getClerkUser();
    const { id: userId } = await tx.user.findFirstOrThrow({
      select: {
        id: true
      },
      where: {
        sub: clerkUser.userId
      }
    });

    // 레코드 추가
    const insert = {
      purpose: form.purpose,
      company: {
        ...form.company,
        thumbnail: undefined,
        businessCard: undefined,
        businessCert: undefined,
      },
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
