import z from "zod";
import { GenreSchema } from "@/resources/genres/genre.dto";
import { WebtoonSchema } from "@/resources/webtoons/dtos/webtoon.dto";
import { BidRoundSchema } from "@/resources/bidRounds/dtos/bidRound.dto";

/* 오퍼 상세 화면 */
export const WebtoonDetailsSchema = WebtoonSchema.extend({
  localized: WebtoonSchema.shape.localized.extend({
    authorOrCreatorName: z.string()
  }),
  genres: z.array(GenreSchema.pick({
    id: true,
    localized: true,
  })),
});
export type WebtoonDetailsT = z.infer<typeof WebtoonDetailsSchema>;

/* 웹툰 전체 화면 */
export const WebtoonDetailsExtendedSchema = WebtoonDetailsSchema
  .extend({
    isEditable: z.boolean(),
    hasRightToOffer: z.boolean(),
    likeCount: z.number(),
    myLike: z.boolean(),
    activeBidRound: BidRoundSchema.optional(),
    firstEpisodeId: z.number().optional()
  });
export type WebtoonDetailsExtendedT = z.infer<typeof WebtoonDetailsExtendedSchema>;
