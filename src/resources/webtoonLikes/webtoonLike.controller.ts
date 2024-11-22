"use server";

import prisma from "@/utils/prisma";
import { getTokenInfo } from "@/resources/tokens/token.controller";
import { action } from "@/handlers/safeAction";
import z from "zod";
import { WebtoonLikeWithMine, WebtoonLikeWithMineT } from "@/resources/webtoonLikes/webtoonLike.types";

export const toggleLike = action
  .metadata({ actionName: "toggleLike" })
  .schema(z.object({
    action: z.enum(["like", "unlike"])
  }))
  .bindArgsSchemas([
    z.number() // webtoonId
  ])
  .outputSchema(WebtoonLikeWithMine)
  .action(async ({
    bindArgsParsedInputs: [webtoonId],
    parsedInput: { action }
  }) => {
    switch (action) {
      case "like":
        return createLike(webtoonId);
      case "unlike":
        return deleteLike(webtoonId);
      default:
        throw new Error("Invalid action");
    }
  });


async function createLike(webtoonId: number): Promise<WebtoonLikeWithMineT> {
  const { userId } = await getTokenInfo();
  const likeCount = await prisma.$transaction(async (tx) => {
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

async function deleteLike(webtoonId: number): Promise<WebtoonLikeWithMineT> {
  const { userId } = await getTokenInfo();
  const likeCount = await prisma.$transaction(async (tx) => {
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
