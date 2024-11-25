"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import { WebtoonLikeCount, WebtoonLikeWithMine } from "@/resources/webtoonLikes/webtoonLike.dto";
import webtoonLikeService from "@/resources/webtoonLikes/webtoonLike.service";

// 바이어용
export const getLikeCountByUserId = action
  .metadata({ actionName: "getLikeCountByUserId" })
  .bindArgsSchemas([
    z.number() // userId
  ])
  .outputSchema(WebtoonLikeCount)
  .action(
    async ( { bindArgsParsedInputs: [userId] }) => {
      return webtoonLikeService.getCountByUserId(userId);
    }
  );

// 저작권자용
export const getMyLikeCount = action
  .metadata({ actionName: "getMyLikeCount" })
  .outputSchema(WebtoonLikeCount)
  .action(
    async () => {
      return webtoonLikeService.getCountByUserId();
    }
  );

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
        return webtoonLikeService.createLike(webtoonId);
      case "unlike":
        return webtoonLikeService.deleteLike(webtoonId);
      default:
        throw new Error("Invalid action");
    }
  });