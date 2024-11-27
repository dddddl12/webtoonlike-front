"use server";

import {
  OfferWithBuyerAndWebtoonSchema, OfferWithActiveProposalSchema,
} from "@/resources/offers/dtos/offer.dto";
import z from "zod";
import { action } from "@/handlers/safeAction";
import offerService from "@/resources/offers/services/offer.service";
import { ListResponseSchema } from "@/resources/globalTypes";

// /admin/offers
export const adminListOffersByBidRoundId = action
  .metadata({ actionName: "adminListOffersByBidRoundId" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .outputSchema(z.array(OfferWithActiveProposalSchema))
  .action(async ({
    bindArgsParsedInputs: [bidRoundId]
  }) => {
    return offerService.listByBidRoundId(bidRoundId);
  });

export const listAllOffers = action
  .metadata({ actionName: "listAllOffers" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(OfferWithBuyerAndWebtoonSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return offerService.listMyOffers({
      page,
      limit: 10
    });
  });
