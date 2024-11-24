"use server";

import {
  AdminOffersBidRequestSchema, BidRequestDetailsSchema,
  BidRequestFormSchema
} from "@/resources/bidRequests/dtos/bidRequest.dto";
import z from "zod";
import { action } from "@/handlers/safeAction";
import bidRequestService from "@/resources/bidRequests/services/bidRequest.service";
import bidRequestWithMetadataService from "@/resources/bidRequests/services/bidRequestWithMetadata.service";

export const adminListAdminOffersBidRequests = action
  .metadata({ actionName: "adminListAdminOffersBidRequests" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .outputSchema(z.array(AdminOffersBidRequestSchema))
  .action(async ({
    bindArgsParsedInputs: [bidRoundId]
  }) => {
    return bidRequestWithMetadataService.adminListAdminOffersBidRequests(bidRoundId);
  });

export const getBidRequest = action
  .metadata({ actionName: "getBidRequest" })
  .bindArgsSchemas([
    z.number() //bidRequestId
  ])
  .outputSchema(BidRequestDetailsSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId]
  }) => {
    return bidRequestService.getDetails(bidRequestId);
  });

export const createBidRequest = action
  .metadata({ actionName: "createBidRequest" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .schema(BidRequestFormSchema)
  .action(async ({
    parsedInput: formData,
    bindArgsParsedInputs: [bidRoundId]
  }) => {
    return bidRequestService.create(bidRoundId, formData);
  });
