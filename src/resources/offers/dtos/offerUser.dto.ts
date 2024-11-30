import { UserSchema } from "@/resources/users/dtos/user.dto";
import z from "zod";
import { CreatorSchema } from "@/resources/creators/creator.dto";
import { BuyerSchema } from "@/resources/buyers/buyer.dto";

export const OfferBaseUserSchema = UserSchema.pick({
  id: true,
  name: true,
  userType: true,
}).extend({
  thumbPath: z.string().optional(),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string(),
  }).optional() // 인보이스 발급 이후에만 노출
});
export type OfferBaseUserT = z.infer<typeof OfferBaseUserSchema>;

export const OfferCreatorSchema = CreatorSchema.pick({
  isAgencyAffiliated: true,
}).extend({
  localized: z.object({
    name: z.string()
  }),
  user: OfferBaseUserSchema,
});
export type OfferCreatorT = z.infer<typeof OfferCreatorSchema>;

export const OfferBuyerSchema = BuyerSchema.pick({
  name: true,
  department: true,
  position: true,
}).extend({
  user: OfferBaseUserSchema,
});
export type OfferBuyerT = z.infer<typeof OfferBuyerSchema>;
