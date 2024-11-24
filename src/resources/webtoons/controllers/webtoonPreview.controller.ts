"use server";

// 바이어용
// /webtoons
// /creators/[userId]
import z from "zod";
import { action } from "@/handlers/safeAction";
import { AgeLimit } from "@/resources/webtoons/dtos/webtoon.dto";
import {
  MyWebtoonNotOnSaleSchema,
  MyWebtoonOnSaleSchema,
  WebtoonPreviewSchema
} from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { ListResponseSchema } from "@/resources/globalTypes";
import webtoonPreviewService from "@/resources/webtoons/services/webtoonPreview.service";

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
    return webtoonPreviewService.list(formData);
  });

export const listWebtoonsByUserId = action
  .metadata({ actionName: "listWebtoonsByUserId" })
  .schema(z.object({
    userId: z.number(),
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({ parsedInput: formData }) => {
    return webtoonPreviewService.list(formData);
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
    return webtoonPreviewService.listLikedWebtoons(parsedInput);
  });

// 저작권자용
// /webtoons (미등록 작품)
export const listMyWebtoonsNotOnSale = action
  .metadata({ actionName: "listMyWebtoonsNotOnSale" })
  .schema(z.object({
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(MyWebtoonNotOnSaleSchema))
  .action(async ({ parsedInput }) => {
    return webtoonPreviewService.listMyWebtoonsNotOnSale(parsedInput);
  });

// 저작권자용
// /webtoons (판매 등록 작품)
export const listMyWebtoonsOnSale = action
  .metadata({ actionName: "listMyWebtoonsOnSale" })
  .schema(z.object({
    page: z.number().default(1)
  }))
  .outputSchema(ListResponseSchema(MyWebtoonOnSaleSchema))
  .action(async ({ parsedInput }) => {
    return webtoonPreviewService.listMyWebtoonsOnSale(parsedInput);
  });