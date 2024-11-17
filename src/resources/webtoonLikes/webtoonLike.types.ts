import z from "zod";

export const WebtoonLikeWithMine = z.object({
  webtoonId: z.number(),
  likeCount: z.number(),
  myLike: z.boolean(),
});
export type WebtoonLikeWithMineT = z.infer<typeof WebtoonLikeWithMine>;
