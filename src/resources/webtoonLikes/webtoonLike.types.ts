import z from "zod";

export const WebtoonLikeSchema = z.object({
  webtoonId: z.number(),
  likeCount: z.number(),
  myLike: z.boolean(),
});
export type WebtoonLikeT = z.infer<typeof WebtoonLikeSchema>
