"use server";

import prisma from "@/utils/prisma";
import { PublicCreatorT } from "@/resources/creators/creator.types";

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
