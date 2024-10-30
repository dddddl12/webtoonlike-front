"use server";

import prisma from "@/utils/prisma";
import { WebtoonLikeT } from "@/resources/webtoonLikes/webtoonLike.types";
import { getUserMetadata } from "@/resources/userMetadata/userMetadata.service";

export async function createLike(webtoonId: number): Promise<WebtoonLikeT> {
  const { likes, WebtoonLike } = await prisma.$transaction(async (tx) => {
    const { id: userId } = await getUserMetadata();
    await tx.webtoonLike.create({
      data: { userId, webtoonId }
    });
    // TODO 일괄 싱크 로직 추가
    return tx.webtoon.update({
      where: { id: webtoonId },
      data: { likes: { increment: 1 } },
      select: {
        likes: true,
        WebtoonLike: {
          where: { userId }
        }
      }
    });
  });
  return {
    webtoonId,
    likes,
    myLike: WebtoonLike.length > 0
  };
}

export async function deleteLike(webtoonId: number): Promise<WebtoonLikeT> {
  const { likes, WebtoonLike } = await prisma.$transaction(async (tx) => {
    const { id: userId } = await getUserMetadata();
    await tx.webtoonLike.deleteMany({
      where: { userId, webtoonId },
    });
    return tx.webtoon.update({
      where: { id: webtoonId },
      data: { likes: { decrement: 1 } },
      select: {
        likes: true,
        WebtoonLike: {
          where: { userId }
        }
      }
    });
  });
  return {
    webtoonId,
    likes,
    myLike: WebtoonLike.length > 0
  };
}
