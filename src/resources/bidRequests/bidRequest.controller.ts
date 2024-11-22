"use server";

import {
  BidRequestFormSchema,
  BidRequestSchema,
  BidRequestStatus
} from "@/resources/bidRequests/bidRequest.types";
import { ListResponseSchema } from "@/resources/globalTypes";
import { UserSchema } from "@/resources/users/user.types";
import { WebtoonSchema } from "@/resources/webtoons/webtoon.types";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.types";
import z from "zod";
import { action } from "@/handlers/safeAction";
import { CreatorSchema } from "@/resources/creators/creator.types";
import bidRequestService from "@/resources/bidRequests/bidRequest.service";

const SimpleBidRequestSchema = BidRequestSchema.extend({
  webtoon: WebtoonSchema.pick({
    id: true,
    title: true,
    title_en: true,
    thumbPath: true
  }),
  creator: z.object({
    user: UserSchema.pick({
      id: true,
      name: true
    })
  }),
  buyer: z.object({
    user: UserSchema.pick({
      id: true,
      name: true
    })
  })
});
export type SimpleBidRequestT = z.infer<typeof SimpleBidRequestSchema>;

export const adminListUninvoicedBidRequests = action
  .metadata({ actionName: "adminListUninvoicedBidRequests" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(SimpleBidRequestSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return bidRequestService.list({
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
  .outputSchema(ListResponseSchema(SimpleBidRequestSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return bidRequestService.list({
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
  .outputSchema(ListResponseSchema(SimpleBidRequestSchema))
  .action(async ({
    parsedInput: { page }
  }) => {
    return bidRequestService.list({
      page,
      limit: 10,
      isAdmin: false,
      uninvoicedOnly: false
    });
  });

export const getSimpleBidRequest = action
  .metadata({ actionName: "getSimpleBidRequest" })
  .bindArgsSchemas([
    z.number() // bidRequestId
  ])
  .outputSchema(SimpleBidRequestSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId]
  }) => {
    return bidRequestService.getSimple(bidRequestId);
  });

const AdminOffersBidRequestSchema = BidRequestSchema.pick({
  id: true,
  createdAt: true,
  status: true,
  contractRange: true
}).extend({
  buyer: z.object({
    user: UserSchema.pick({
      name: true
    })
  })
});
export type AdminOffersBidRequestT = z.infer<typeof AdminOffersBidRequestSchema>;
export const adminListAdminOffersBidRequests = action
  .metadata({ actionName: "adminListAdminOffersBidRequests" })
  .bindArgsSchemas([
    z.number() // bidRoundId
  ])
  .outputSchema(z.array(AdminOffersBidRequestSchema))
  .action(async ({
    bindArgsParsedInputs: [bidRoundId]
  }) => {
    return bidRequestService.adminListAdminOffersBidRequests(bidRoundId);
  });

const BidRequestDetailsSchema = BidRequestSchema
  .extend({
    webtoon: WebtoonSchema.extend({
      activeBidRound: z.object({
        isNew: z.boolean(),
        totalEpisodeCount: z.number().optional()
      }),
      authorOrCreatorName: z.string(),
      authorOrCreatorName_en: z.string().optional(),
      genres: z.array(
        z.object({
          id: z.number(),
          label: z.string(),
          label_en: z.string().optional()
        })
      )
    }),
    creator: CreatorSchema.pick({
      name: true,
      name_en: true,
      isAgencyAffiliated: true,
    }).extend({
      user: UserSchema.pick({
        name: true,
      }).extend({
        phone: z.string().optional(),
        email: z.string().optional(),
        thumbPath: z.string().optional()
      })
    }),
    buyer: BuyerCompanySchema.pick({
      name: true,
      dept: true,
      position: true,
    }).extend({
      user: UserSchema.pick({
        name: true,
      }).extend({
        phone: z.string().optional(),
        email: z.string().optional(),
        thumbPath: z.string().optional()
      })
    })
  });
export type BidRequestDetailsT = z.infer<typeof BidRequestDetailsSchema>;
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
  .outputSchema(SimpleBidRequestSchema)
  .action(async ({
    bindArgsParsedInputs: [bidRequestId],
    parsedInput
  }) => {
    return await bidRequestService.changeStatus(bidRequestId, parsedInput);
  });
