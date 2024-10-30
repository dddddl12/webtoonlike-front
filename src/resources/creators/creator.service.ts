"use server";

import prisma from "@/utils/prisma";
import { CreatorFormT } from "@/resources/creators/creator.types";
import { getClerkUser, updateUserMetadata } from "@/resources/userMetadata/userMetadata.service";
import { BaseClerkUserMetadata, ClerkUserMetadata } from "@/resources/userMetadata/userMetadata.types";

export async function createCreator(form: CreatorFormT ) {
  // TODO
  const { thumbnail } = form.files;
  // if (thumbnail) {
  //   form.companyInfo.thumbPath = await uploadFile(thumbnail, "buyers/thumbnails");
  // }
  await prisma.$transaction(async (tx) => {
    const clerkUser = await getClerkUser();
    const { id } = (clerkUser.sessionClaims.metadata as BaseClerkUserMetadata | ClerkUserMetadata);

    // 레코드 추가
    const insert = {
      name: form.name,
      name_en: form.name_en,
      thumbPath: form.thumbPath,
      isExposed: form.isExposed,
      isExperienced: form.isExperienced,
      isAgencyAffiliated: form.isAgencyAffiliated,
      userId: id
    };

    await tx.creator.upsert({
      create: insert,
      update: insert,
      where: {
        userId: id
      }
    });

    await updateUserMetadata(tx);
  });
}
