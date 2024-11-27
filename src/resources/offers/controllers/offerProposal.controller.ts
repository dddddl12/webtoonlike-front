"use server";

import {
  changeOfferStatusParamsSchema, OfferDetailsSchema, OfferProposalDetailsSchema,
  OfferProposalFormSchema,
  OfferProposalListSchema
} from "@/resources/offers/dtos/offerProposal.dto";
import z from "zod";
import { action } from "@/handlers/safeAction";
import offerProposalService from "@/resources/offers/services/offerProposal.service";

export const listOfferProposals = action
  .metadata({ actionName: "listOfferProposals" })
  .bindArgsSchemas([
    z.number() // offerId
  ])
  .outputSchema(
    OfferProposalListSchema
  )
  .action(
    async ({
      bindArgsParsedInputs: [offerId],
    }) => {
      return offerProposalService.list(offerId);
    }
  );

export const createOffer = action
  .metadata({ actionName: "createOffer" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .schema(OfferProposalFormSchema)
  .action(
    async ({
      bindArgsParsedInputs: [bidRoundId],
      parsedInput: formData
    }) => {
      return offerProposalService.createFromScratch(bidRoundId, formData);
    });

export const createOfferProposal = action
  .metadata({ actionName: "createOfferProposal" })
  .bindArgsSchemas([
    z.number(), // offerId
    z.number() // refOfferProposalId
  ])
  .schema(OfferProposalFormSchema)
  .action(
    async ({
      bindArgsParsedInputs: [offerId, refOfferProposalId],
      parsedInput: formData
    }) => {
      return offerProposalService.create(offerId, refOfferProposalId, formData);
    });

export const changeOfferProposalStatus = action
  .metadata({ actionName: "changeOfferProposalStatus" })
  .bindArgsSchemas([
    z.number() // offerProposalId
  ])
  .schema(changeOfferStatusParamsSchema)
  .action(async ({
    bindArgsParsedInputs: [offerProposalId],
    parsedInput
  }) => {
    return await offerProposalService.changeStatus(offerProposalId, parsedInput);
  });


export const getOfferProposalDetails = action
  .metadata({ actionName: "getOfferProposalDetails" })
  .bindArgsSchemas([
    z.number() //offerProposalId
  ])
  .outputSchema(OfferProposalDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [offerProposalId]
  }) => {
    return offerProposalService.getOfferProposalDetails(offerProposalId);
  });

export const getOfferDetails = action
  .metadata({ actionName: "getOfferDetails" })
  .bindArgsSchemas([
    z.number() //offerProposalId
  ])
  .outputSchema(OfferDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [offerProposalId]
  }) => {
    return offerProposalService.getOfferDetails(offerProposalId);
  });
