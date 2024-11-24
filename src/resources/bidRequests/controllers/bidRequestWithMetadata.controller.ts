"use server";

import { action } from "@/handlers/safeAction";
import z from "zod";
import { ListResponseSchema } from "@/resources/globalTypes";
import bidRequestWithMetadataService from "@/resources/bidRequests/services/bidRequestWithMetadata.service";
import { BidRequestStatus } from "@/resources/bidRequests/dtos/bidRequest.dto";
import { BidRequestWithMetaDataSchema } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";

export const adminListUninvoicedBidRequests = action
  .metadata({ actionName: "adminListUninvoicedBidRequests" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(BidRequestWithMetaDataSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return bidRequestWithMetadataService.list({
      page,
      limit: 5,
      isAdmin: true,
      uninvoicedOnly: true
    });
  });

export const listUninvoicedBidRequests = action
  .metadata({ actionName: "listUninvoicedBidRequests" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(BidRequestWithMetaDataSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return bidRequestWithMetadataService.list({
      page,
      limit: 5,
      isAdmin: false,
      uninvoicedOnly: true
    });
  });

export const listAllBidRequests = action
  .metadata({ actionName: "listAllBidRequests" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(BidRequestWithMetaDataSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return bidRequestWithMetadataService.list({
      page,
      limit: 10,
      isAdmin: false,
      uninvoicedOnly: false
    });
  });

export const getBidRequestWithMetaDataSchema = action
  .metadata({ actionName: "getBidRequestWithMetaDataSchema" })
  .bindArgsSchemas([
    z.number() // bidRequestId
  ])
  .outputSchema(BidRequestWithMetaDataSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId]
  }) => {
    return bidRequestWithMetadataService.get(bidRequestId);
  });


// /offers 오퍼 승인 또는 취소
const changeBidRequestStatusParamsSchema = z.object({
  changeTo: z.enum([BidRequestStatus.Accepted, BidRequestStatus.Declined]),
  refMessageId: z.number().optional()
});
export type ChangeBidRequestStatusParamsT = z.infer<typeof changeBidRequestStatusParamsSchema>;
export const changeBidRequestStatus = action
  .metadata({ actionName: "changeBidRequestStatus" })
  .bindArgsSchemas([
    z.number(), //bidRequestId
  ])
  .schema(changeBidRequestStatusParamsSchema)
  .outputSchema(BidRequestWithMetaDataSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId],
    parsedInput
  }) => {
    return await bidRequestWithMetadataService.changeStatus(bidRequestId, parsedInput);
  });
