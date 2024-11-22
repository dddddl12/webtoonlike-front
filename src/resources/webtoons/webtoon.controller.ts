"use server";

import {
  AgeLimit,
  WebtoonFormSchema, WebtoonPreviewSchema, WebtoonSchema
} from "@/resources/webtoons/webtoon.types";
import { BidRoundApprovalStatus, BidRoundSchema, BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { ListResponseSchema } from "@/resources/globalTypes";
import z from "zod";
import { action } from "@/handlers/safeAction";
import webtoonService from "@/resources/webtoons/webtoon.service";

// TODO 권한, 사용자 타입, 관리자 체크
export const createOrUpdateWebtoon = action
  .schema(WebtoonFormSchema)
  .metadata({ actionName: "createOrUpdateWebtoon" })
  .bindArgsSchemas([
    z.number().optional() // webtoonId
  ])
  .action(async ({
    parsedInput: formData,
    bindArgsParsedInputs: [webtoonId]
  }) => {
    if (webtoonId){
      await webtoonService.update(webtoonId, formData);
    } else {
      await webtoonService.create(formData);
    }
  });

// 바이어용
// /webtoons
// /creators/[userId]
const WebtoonFilterSchema = z.object({
  genreIds: z.array(z.number()).default([]),
  ageLimits: z.array(z.nativeEnum(AgeLimit)).default([]),
  page: z.number().default(1)
});
export type WebtoonFilterT = z.infer<typeof WebtoonFilterSchema>;
export const listWebtoons = action
  .metadata({ actionName: "listWebtoons" })
  .schema(WebtoonFilterSchema)
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({ parsedInput: formData }) => {
    return webtoonService.list(formData);
  });

export const listWebtoonsByUserId = action
  .metadata({ actionName: "listWebtoonsByUserId" })
  .schema(z.object({
    userId: z.number(),
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({ parsedInput: formData }) => {
    return webtoonService.list(formData);
  });


// 바이어용
// /account
export const listLikedWebtoons = action
  .metadata({ actionName: "listLikedWebtoons" })
  .schema(z.object({
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({ parsedInput }) => {
    return webtoonService.listLikedWebtoons(parsedInput);
  });

// 저작권자용
// /webtoons (미등록 작품)
const MyWebtoonNotOnSaleSchema = WebtoonPreviewSchema.extend({
  createdAt: z.date(),
  bidRoundApprovalStatus: z.nativeEnum(BidRoundApprovalStatus).optional(),
  episodeCount: z.number()
});
export type MyWebtoonNotOnSaleT = z.infer<typeof MyWebtoonNotOnSaleSchema>;
export const listMyWebtoonsNotOnSale = action
  .metadata({ actionName: "listMyWebtoonsNotOnSale" })
  .schema(z.object({
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(MyWebtoonNotOnSaleSchema))
  .action(async ({ parsedInput }) => {
    return webtoonService.listMyWebtoonsNotOnSale(parsedInput);
  });

// 저작권자용
// /webtoons (판매 등록 작품)
const MyWebtoonOnSaleSchema = WebtoonPreviewSchema.extend({
  bidRoundApprovedAt: z.date(),
  bidRoundStatus: z.nativeEnum(BidRoundStatus)
});
export type MyWebtoonOnSaleT = z.infer<typeof MyWebtoonOnSaleSchema>;
export const listMyWebtoonsOnSale = action
  .metadata({ actionName: "listMyWebtoonsOnSale" })
  .schema(z.object({
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(MyWebtoonOnSaleSchema))
  .action(async ({ parsedInput }) => {
    return webtoonService.listMyWebtoonsOnSale(parsedInput);
  });

// /webtoon/[webtoonId]
// /webtoon/create
// /webtoon/[webtoonId]/update // todo 기본 정보용 엔드포인트 따로 생성
const WebtoonDetailsSchema = WebtoonSchema
  .extend({
    // From joined tables
    isEditable: z.boolean(),
    hasRightToOffer: z.boolean(),
    authorOrCreatorName: z.string(),
    // todo 서버에서 언어 판단 미리 할 것
    authorOrCreatorName_en: z.string().optional(),
    likeCount: z.number(),
    myLike: z.boolean(),
    genres: z.array(z.object({
      id: z.number(),
      label: z.string(),
      label_en: z.string().optional(),
    })),
    activeBidRound: BidRoundSchema.optional(),
    firstEpisodeId: z.number().optional()
  });
export type WebtoonDetailsT = z.infer<typeof WebtoonDetailsSchema>;
export const getWebtoon = action
  .metadata({ actionName: "getWebtoon" })
  .bindArgsSchemas([
    z.number() // webtoonId
  ])
  .outputSchema(WebtoonDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [webtoonId]
  }) => {
    return webtoonService.get(webtoonId);
  });
