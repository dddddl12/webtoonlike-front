/* 관리자 기능 */
import z from "zod";
import { BidRoundSchema } from "@/resources/bidRounds/dtos/bidRound.dto";
import { UserSchema } from "@/resources/users/dtos/user.dto";
import { WebtoonPreviewSchema } from "@/resources/webtoons/dtos/webtoonPreview.dto";

export const BidRoundAdminSettingsSchema = z.object({
  bidStartsAt: z.date().optional(),
  negoStartsAt: z.date().optional(),
  processEndsAt: z.date().optional(),
  adminNote: z.string().optional(),
});
export type BidRoundAdminSettingsT = z.infer<typeof BidRoundAdminSettingsSchema>;

export const StrictBidRoundAdminSettingsSchema = BidRoundAdminSettingsSchema
  .required({
    bidStartsAt: true,
    negoStartsAt: true,
    processEndsAt: true,
  })
  .superRefine((val, ctx) => {
    const { bidStartsAt, negoStartsAt, processEndsAt } = val;
    if (bidStartsAt > negoStartsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bidStartsAt"],
        message: "게시 시작일은 선공개 종료일보다 이전이어야 합니다.",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["negoStartsAt"],
        message: "게시 시작일은 선공개 종료일보다 이전이어야 합니다.",
      });
      return z.NEVER;
    }
    if (negoStartsAt > processEndsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["negoStartsAt"],
        message: "선공개 종료일은 게시 종료일보다 이전이어야 합니다.",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["processEndsAt"],
        message: "선공개 종료일은 게시 종료일보다 이전이어야 합니다.",
      });
      return z.NEVER;
    }
  });
export type StrictBidRoundAdminSettingsT = z.infer<typeof StrictBidRoundAdminSettingsSchema>;

export const AdminPageBidRoundSchema = BidRoundSchema.pick({
  id: true,
  status: true,
  createdAt: true,
}).extend({
  adminSettings: BidRoundAdminSettingsSchema,
  webtoon: WebtoonPreviewSchema,
  creator: z.object({
    user: UserSchema.pick({
      name: true
    })
  })
});
export type AdminPageBidRoundT = z.infer<typeof AdminPageBidRoundSchema>;

export const AdminPageBidRoundWithOffersSchema = AdminPageBidRoundSchema
  .extend({
    offerCount: z.number(),
  });
export type AdminPageBidRoundWithOffersT = z.infer<typeof AdminPageBidRoundWithOffersSchema>;