"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import { WebtoonLikeWithMine } from "@/resources/webtoonLikes/webtoonLike.types";
import webtoonLikeService from "@/resources/webtoonLikes/webtoonLike.service";

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