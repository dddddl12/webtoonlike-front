import { WebtoonSchema } from "@/resources/webtoons/dtos/webtoon.dto";
import z from "zod";
import { BidRoundApprovalStatus, BidRoundStatus } from "@/resources/bidRounds/dtos/bidRound.dto";

/* 그리드에 표시하기 위한 간단폼 */
export const WebtoonPreviewSchema = WebtoonSchema.pick({
  id: true,
  thumbPath: true,
  localized: true
});
export type WebtoonPreviewT = z.infer<typeof WebtoonPreviewSchema>;

/* 저작권자 > 미등록 작품 */
export const MyWebtoonNotOnSaleSchema = WebtoonPreviewSchema.extend({
  createdAt: z.date(),
  bidRoundApprovalStatus: z.nativeEnum(BidRoundApprovalStatus).optional(),
  episodeCount: z.number()
});
export type MyWebtoonNotOnSaleT = z.infer<typeof MyWebtoonNotOnSaleSchema>;

/* 저작권자 > 판매 등록 작품 */
export const MyWebtoonOnSaleSchema = WebtoonPreviewSchema.extend({
  bidRoundApprovedAt: z.date(),
  bidRoundStatus: z.nativeEnum(BidRoundStatus)
});
export type MyWebtoonOnSaleT = z.infer<typeof MyWebtoonOnSaleSchema>;
