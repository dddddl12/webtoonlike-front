"use server";

import {
  BidRoundAdminSettingsSchema,
  BidRoundApprovalStatus,
  BidRoundFormSchema,
  BidRoundSchema, StrictBidRoundAdminSettingsSchem
} from "@/resources/bidRounds/bidRound.types";
import { ListResponseSchema } from "@/resources/globalTypes";
import { WebtoonSchema } from "@/resources/webtoons/webtoon.types";
import z from "zod";
import { UserSchema } from "@/resources/users/user.types";
import { action } from "@/handlers/safeAction";
import bidRoundService from "@/resources/bidRounds/bidRound.service";

export const createOrUpdateBidRound = action
  .metadata({ actionName: "createOrUpdateBidRound" })
  .bindArgsSchemas([
    z.number(), // webtoonId
    z.number().optional() // bidRoundId
  ])
  .schema(BidRoundFormSchema)
  .action(async ({
    bindArgsParsedInputs: [webtoonId, bidRoundId],
    parsedInput: dataForm,
  }) => {
    if (bidRoundId !== undefined) {
      await bidRoundService.update(bidRoundId, webtoonId, dataForm);
    } else {
      await bidRoundService.create(webtoonId, dataForm);
    }
  });


export const getBidRoundByWebtoonId = action
  .metadata({ actionName: "getBidRoundByWebtoonId" })
  .bindArgsSchemas([
    z.number() // webtoonId
  ])
  .outputSchema(BidRoundSchema)
  .action(async ({ bindArgsParsedInputs: [webtoonId] }) => {
    return bidRoundService.getByWebtoonId(webtoonId);
  });

// 관리자 기능
const AdminPageBidRoundSchema = BidRoundSchema.pick({
  id: true,
  status: true,
  createdAt: true,
}).extend({
  adminSettings: BidRoundAdminSettingsSchema,
  webtoon: WebtoonSchema.pick({
    id: true,
    title: true,
    description: true,
    thumbPath: true,
  }),
  creator: z.object({
    user: UserSchema.pick({
      name: true
    })
  })
});
export type AdminPageBidRoundT = z.infer<typeof AdminPageBidRoundSchema>;
const AdminPageBidRoundFilterSchema = z.object({
  page: z.number().default(1),
  approvalStatus: z.nativeEnum(BidRoundApprovalStatus)
});
export type AdminPageBidRoundFilterT = z.infer<typeof AdminPageBidRoundFilterSchema>;
export const adminListBidRoundsWithWebtoon = action
  .metadata({ actionName: "adminListBidRoundsWithWebtoon" })
  .schema(AdminPageBidRoundFilterSchema)
  .outputSchema(ListResponseSchema(AdminPageBidRoundSchema))
  .action(async ({ parsedInput: parsedInput }) => {
    return bidRoundService.adminListBidRoundsWithWebtoon(parsedInput);
  });

const AdminPageBidRoundWithOffersSchema = BidRoundSchema
  .pick({
    id: true,
  })
  .extend({
    negoStartsAt: z.date().optional(),
    webtoon: WebtoonSchema.pick({
      id: true,
      title: true,
      title_en: true,
      thumbPath: true,
    }),
    creator: z.object({
      user: UserSchema.pick({
        name: true
      })
    }),
    offerCount: z.number(),
  });
export type AdminPageBidRoundWithOffersT = z.infer<typeof AdminPageBidRoundWithOffersSchema>;
export const adminListBidRoundsWithOffers = action
  .metadata({ actionName: "adminListBidRoundsWithOffers" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(AdminPageBidRoundWithOffersSchema))
  .action(async ({ parsedInput }) => {
    return bidRoundService.adminListBidRoundsWithOffers(parsedInput);
  });

export const approveOrDisapproveBidRound = action
  .metadata({ actionName: "approveOrDisapproveBidRound" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .schema(z.object({
    action: z.enum(["approve", "disapprove"]),
  }))
  .action(async ({ bindArgsParsedInputs: [bidRoundId], parsedInput: { action } }) => {
    switch (action) {
      case "approve":
        await bidRoundService.approve(bidRoundId);
        break;
      case "disapprove":
        await bidRoundService.disapprove(bidRoundId);
        break;
      default:
        throw Error("invalid action");
    }
  });

export const editBidRoundAdminSettings = action
  .metadata({ actionName: "editBidRoundAdminSettings" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .schema(StrictBidRoundAdminSettingsSchem)
  .action(async ({ bindArgsParsedInputs: [bidRoundId], parsedInput: settings }) => {
    return bidRoundService.editBidRoundAdminSettings(bidRoundId, settings);
  });
