"use server";

import prisma from "@/utils/prisma";
import { CreatorFormT, PublicCreatorT } from "@/resources/creators/creator.types";
import { getClerkUser, updateTokenInfo } from "@/resources/tokens/token.service";

export async function createCreator(form: CreatorFormT ) {
  // TODO
  const { thumbnail } = form.files;
  // if (thumbnail) {
  //   form.company.thumbPath = await uploadFile(thumbnail, "buyers/thumbnails");
  // }
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

export async function getCreator(creatorUid: number): Promise<PublicCreatorT> {
  const record = await prisma.creator.findUniqueOrThrow({
    where: {
      userId: creatorUid,
      // isExposed: true, //TODO
    },
    select: {
      name: true,
      name_en: true,
      thumbPath: true,
    }
  });
  return {
    name: record.name,
    name_en: record.name_en ?? undefined,
    thumbPath: record.thumbPath ?? undefined,
  };
}
