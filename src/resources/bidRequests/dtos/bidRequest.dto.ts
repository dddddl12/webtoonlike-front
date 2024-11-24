import { BidRoundSchema, ContractRangeItemSchema } from "@/resources/bidRounds/dtos/bidRound.dto";
import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { UserSchema } from "@/resources/users/dtos/user.dto";
import { CreatorSchema } from "@/resources/creators/creator.dto";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.dto";
import { WebtoonDetailsSchema } from "@/resources/webtoons/dtos/webtoonDetails.dto";

export enum BidRequestStatus {
  Pending = "PENDING",
  Waiting = "WAITING",
  Negotiating = "NEGOTIATING",
  Declined = "DECLINED",
  Accepted = "ACCEPTED",
}

export const BidRequestContractRangeItemSchema = ContractRangeItemSchema.extend({
  message: z.string().optional(),
});
const BidRequestBaseSchema = z.object({
  message: z.string().optional(),
  contractRange: z.array(BidRequestContractRangeItemSchema),
});

export const BidRequestFormSchema = BidRequestBaseSchema;
export type BidRequestFormT = z.infer<typeof BidRequestFormSchema>;

export const BidRequestSchema = BidRequestBaseSchema
  .merge(ResourceSchema)
  .extend({
    bidRoundId: z.number(),
    userId: z.number(),
    status: z.nativeEnum(BidRequestStatus),
    decidedAt: z.date().optional(),
  });
export type BidRequestT = z.infer<typeof BidRequestSchema>;

/* 관리자 페이지 오퍼 목록*/
export const AdminOffersBidRequestSchema = BidRequestSchema.pick({
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

/* 상세 오퍼 */
export const BidRequestDetailsSchema = BidRequestSchema
  .extend({
    webtoon: WebtoonDetailsSchema.extend({
      activeBidRound: BidRoundSchema.pick({
        isNew: true,
        currentEpisodeNo: true,
        totalEpisodeCount: true,
      })
    }),
    creator: CreatorSchema.pick({
      isAgencyAffiliated: true,
    }).extend({
      localized: z.object({
        name: z.string()
      }),
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