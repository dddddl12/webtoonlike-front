"use server";

import prisma from "@/utils/prisma";
import { CreatorFormT } from "@/resources/creators/creator.types";
import { getClerkUser, updateTokenInfo } from "@/resources/tokens/token.service";

export async function createCreator(form: CreatorFormT ) {
  // TODO
  const { thumbnail } = form.files;
  // if (thumbnail) {
  //   form.company.thumbPath = await uploadFile(thumbnail, "buyers/thumbnails");
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
      name: form.name,
      name_en: form.name_en,
      thumbPath: form.thumbPath,
      isExposed: form.isExposed,
      isExperienced: form.isExperienced,
      isAgencyAffiliated: form.isAgencyAffiliated,
      userId
    };

    await tx.creator.upsert({
      create: insert,
      update: insert,
      where: {
        userId
      }
    });

    await updateTokenInfo(tx);
  });
}
