"use server";

import prisma from "@/utils/prisma";
import { WebtoonLikeT } from "@/resources/webtoonLikes/webtoonLike.types";
import { getTokenInfo } from "@/resources/tokens/token.service";

export async function createLike(webtoonId: number): Promise<WebtoonLikeT> {
  const likeCount = await prisma.$transaction(async (tx) => {
    const { userId } = await getTokenInfo();
    await tx.webtoonLike.upsert({
      where: {
        userId_webtoonId: { userId, webtoonId },
      },
      create: { userId, webtoonId },
      update: {}
    });
    const { _count } = await tx.webtoonLike.aggregate({
      where: { webtoonId },
      _count: true
    });
    return _count;
  });
  return {
    webtoonId,
    likeCount,
    myLike: true
  };
}

export async function deleteLike(webtoonId: number): Promise<WebtoonLikeT> {
  const likeCount = await prisma.$transaction(async (tx) => {
    const { userId } = await getTokenInfo();
    await tx.webtoonLike.deleteMany({
      where: { userId, webtoonId }
    });
    const { _count } = await tx.webtoonLike.aggregate({
      where: { webtoonId },
      _count: true
    });
    return _count;
  });
  return {
    webtoonId,
    likeCount,
    myLike: false
  };
}
