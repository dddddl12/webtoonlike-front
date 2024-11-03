"use server";

import prisma from "@/utils/prisma";
import { WebtoonLikeT } from "@/resources/webtoonLikes/webtoonLike.types";
import { getUserMetadata } from "@/resources/userMetadata/userMetadata.service";

export async function createLike(webtoonId: number): Promise<WebtoonLikeT> {
  const likeCount = await prisma.$transaction(async (tx) => {
    const { id: userId } = await getUserMetadata();
    console.log(userId, webtoonId);
    await tx.webtoonLike.create({
      // where: {
      //   userId_webtoonId: { userId, webtoonId },
      // },
      data: { userId, webtoonId },
      // update: {}
    });
    const { _count } = await tx.webtoonLike.aggregate({
      where: { webtoonId },
      _count: {
        id: true,
      }
    });
    return _count.id;
  });
  return {
    webtoonId,
    likeCount,
    myLike: true
  };
}

export async function deleteLike(webtoonId: number): Promise<WebtoonLikeT> {
  const likeCount = await prisma.$transaction(async (tx) => {
    const { id: userId } = await getUserMetadata();
    await tx.webtoonLike.deleteMany({
      where: { userId, webtoonId }
    });
    const { _count } = await tx.webtoonLike.aggregate({
      where: { webtoonId },
      _count: {
        id: true,
      }
    });
    return _count.id;
  });
  return {
    webtoonId,
    likeCount,
    myLike: false
  };
}
