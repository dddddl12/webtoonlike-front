"use server";

import { BuyerFormT } from "@/resources/buyers/buyer.types";
import prisma from "@/utils/prisma";
import { getUserInfo } from "@/utils/auth/server";
import { updateClerkUser } from "@/resources/users/user.service";

export async function createBuyer(form: BuyerFormT ) {
  // TODO
  const { thumbnail, businessCard, businessCert } = form.companyInfo;
  // if (thumbnail) {
  //   form.companyInfo.thumbPath = await uploadFile(thumbnail, "buyers/thumbnails");
  // }
  // if (businessCard) {
  //   form.companyInfo.businessCardPath = await uploadFile(businessCard, "buyers/business_cards");
  // }
  // if (businessCert) {
  //   form.companyInfo.businessCertPath = await uploadFile(businessCert, "buyers/business_certs");
  // }
  await prisma.$transaction(async (tx) => {
    const { id } = await getUserInfo();

    // 레코드 추가
    const insert = {
      ...form,
      companyInfo: {
        ...form.companyInfo,
        thumbnail: undefined,
        businessCard: undefined,
        businessCert: undefined,
      },
      userId: id
    };

    await tx.buyer.upsert({
      create: insert,
      update: insert,
      where: {
        userId: id
      }
    });

    await updateClerkUser(tx);
  });
}
