"use server";

// 관리자 기능
import { action } from "@/handlers/safeAction";
import z from "zod";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import { ListResponseSchema, PaginationSchema } from "@/resources/globalTypes";
import {
  AdminPageBidRoundSchema,
  AdminPageBidRoundWithOffersSchema,
  BidRoundAdminSettingsSchema,
  StrictBidRoundAdminSettingsSchema
} from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import bidRoundAdminService from "@/resources/bidRounds/services/bidRoundAdmin.service";

const AdminPageBidRoundFilterSchema = PaginationSchema.extend({
  approvalStatus: z.nativeEnum(BidRoundApprovalStatus)
});
export type AdminPageBidRoundFilterT = z.infer<typeof AdminPageBidRoundFilterSchema>;
export const adminListBidRoundsWithWebtoon = action
  .metadata({ actionName: "adminListBidRoundsWithWebtoon" })
  .schema(AdminPageBidRoundFilterSchema)
  .outputSchema(ListResponseSchema(AdminPageBidRoundSchema))
  .action(async ({ parsedInput: parsedInput }) => {
    return bidRoundAdminService.adminListBidRoundsWithWebtoon(parsedInput);
  });

export const adminListBidRoundsWithOffers = action
  .metadata({ actionName: "adminListBidRoundsWithOffers" })
  .schema(PaginationSchema)
  .outputSchema(ListResponseSchema(AdminPageBidRoundWithOffersSchema))
  .action(async ({ parsedInput }) => {
    return bidRoundAdminService.adminListBidRoundsWithOffers(parsedInput);
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
        await bidRoundAdminService.approve(bidRoundId);
        break;
      case "disapprove":
        await bidRoundAdminService.disapprove(bidRoundId);
        break;
      default:
        throw Error("invalid action");
    }
  });

export const getBidRoundAdminSettings = action
  .metadata({ actionName: "getBidRoundAdminSettings" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .outputSchema(BidRoundAdminSettingsSchema)
  .action(async (
    { bindArgsParsedInputs: [bidRoundId] }) => {
    return bidRoundAdminService.getBidRoundAdminSettings(bidRoundId);
  });

export const editBidRoundAdminSettings = action
  .metadata({ actionName: "editBidRoundAdminSettings" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .schema(StrictBidRoundAdminSettingsSchema)
  .action(async ({ bindArgsParsedInputs: [bidRoundId], parsedInput: settings }) => {
    return bidRoundAdminService.editBidRoundAdminSettings(bidRoundId, settings);
  });
