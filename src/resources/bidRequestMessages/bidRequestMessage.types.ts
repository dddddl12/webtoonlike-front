import z from "zod";
import { ResourceSchema } from "@/resources/globalTypes";
import { UserTypeT } from "@/resources/users/user.types";

const BidRequestMessageBaseSchema = z.object({
  bidRequestId: z.number(),
  content: z.string(),
});

export const BidRequestMessageFormSchema = BidRequestMessageBaseSchema;
export type BidRequestMessageFormT = z.infer<typeof BidRequestMessageFormSchema>

export const BidRequestMessageSchema = BidRequestMessageBaseSchema
  .merge(ResourceSchema);
export type BidRequestMessageT = z.infer<typeof BidRequestMessageSchema>;

export const BidRequestMessageExtendedSchema = BidRequestMessageSchema
  .extend({
    user: z.object({
      id: z.number(),
      userType: z.nativeEnum(UserTypeT),
      name: z.string(),
    })
  });
export type BidRequestMessageExtendedT = z.infer<typeof BidRequestMessageExtendedSchema>;