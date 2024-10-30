"use server";

import { BuyerFormT } from "@/resources/buyers/buyer.types";
import prisma from "@/utils/prisma";
import { getClerkUser, updateUserMetadata } from "@/resources/userMetadata/userMetadata.service";
import {
  BaseClerkUserMetadata,
  ClerkUserMetadata
} from "@/resources/userMetadata/userMetadata.types";
import { NotSignedInError } from "@/errors";

export async function createBuyer(form: BuyerFormT ) {
  // TODO
  const { thumbnail, businessCard, businessCert } = form.files;
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
    const clerkUser = await getClerkUser();
    const { id } = (clerkUser.sessionClaims.metadata as BaseClerkUserMetadata | ClerkUserMetadata);

    // 레코드 추가
    const insert = {
      purpose: form.purpose,
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

    await updateUserMetadata(tx);
  });
}
