"use server";

import prisma from "@/utils/prisma";
import { getUserInfo } from "@/utils/auth/server";
import { updateClerkUser } from "@/resources/users/user.service";
import { CreatorFormT } from "@/resources/creators/creator.types";

export async function createCreator(form: CreatorFormT ) {
  // TODO
  const { thumbnail } = form;
  // if (thumbnail) {
  //   form.companyInfo.thumbPath = await uploadFile(thumbnail, "buyers/thumbnails");
  // }
  await prisma.$transaction(async (tx) => {
    const { id } = await getUserInfo();

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

    await updateClerkUser(tx);
  });
}
