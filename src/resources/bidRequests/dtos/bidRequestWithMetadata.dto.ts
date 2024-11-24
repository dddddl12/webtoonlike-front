/*기본 추가 정보*/
import { UserSchema } from "@/resources/users/dtos/user.dto";
import { BidRequestSchema } from "@/resources/bidRequests/dtos/bidRequest.dto";
import z from "zod";
import { WebtoonPreviewSchema } from "@/resources/webtoons/dtos/webtoonPreview.dto";

export const BidRequestWithMetaDataSchema = BidRequestSchema.extend({
  webtoon: WebtoonPreviewSchema,
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
export type BidRequestWithMetaDataT = z.infer<typeof BidRequestWithMetaDataSchema>;
