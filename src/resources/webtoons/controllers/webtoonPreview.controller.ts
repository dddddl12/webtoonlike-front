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
import { ListResponseSchema, PaginationSchema } from "@/resources/globalTypes";
import webtoonPreviewService from "@/resources/webtoons/services/webtoonPreview.service";

const WebtoonFilterSchema = PaginationSchema.extend({
  genreIds: z.array(z.number()).default([]),
  ageLimits: z.array(z.nativeEnum(AgeLimit)).default([])
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
  .bindArgsSchemas([
    z.number()
  ])
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({
    bindArgsParsedInputs: [userId],
    parsedInput: formData
  }) => {
    return webtoonPreviewService.list({
      ...formData,
      userId
    });
  });

// 바이어용
// /account
export const listLikedWebtoons = action
  .metadata({ actionName: "listLikedWebtoons" })
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(WebtoonPreviewSchema))
  .action(async ({ parsedInput }) => {
    return webtoonPreviewService.listLikedWebtoons(parsedInput);
  });

// 저작권자용
// /webtoons (미등록 작품)
export const listMyWebtoonsNotOnSale = action
  .metadata({ actionName: "listMyWebtoonsNotOnSale" })
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(MyWebtoonNotOnSaleSchema))
  .action(async ({ parsedInput }) => {
    return webtoonPreviewService.listMyWebtoonsNotOnSale(parsedInput);
  });

// 저작권자용
// /webtoons (판매 등록 작품)
export const listMyWebtoonsOnSale = action
  .metadata({ actionName: "listMyWebtoonsOnSale" })
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(MyWebtoonOnSaleSchema))
  .action(async ({ parsedInput }) => {
    return webtoonPreviewService.listMyWebtoonsOnSale(parsedInput);
  });