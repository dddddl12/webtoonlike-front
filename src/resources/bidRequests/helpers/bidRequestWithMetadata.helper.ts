import "server-only";
import { Prisma } from "@prisma/client";
import bidRequestHelper from "@/resources/bidRequests/helpers/bidRequest.helper";
import { BidRequestWithMetaDataT } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";
import WebtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";
import webtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";

class BidRequestWithMetadataHelper {
  query = Prisma.validator<Prisma.BidRequestDefaultArgs>()({
    include: {
      bidRound: {
        select: {
          webtoon: {
            select: {
              ...webtoonPreviewHelper.query.select,
              user: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  mapToDTO = (
    r: Prisma.BidRequestGetPayload<typeof this.query>,
    locale: string
  ): BidRequestWithMetaDataT => {
    const { webtoon } = r.bidRound;
    const creatingUser = webtoon.user;
    const buyingUser = r.user;

    return {
      ...bidRequestHelper.mapToDTO(r),
      webtoon: WebtoonPreviewHelper.mapToDTO(webtoon, locale),
      creator: {
        user: {
          id: creatingUser.id,
          name: creatingUser.name
        }
      },
      buyer: {
        user: {
          id: buyingUser.id,
          name: buyingUser.name
        }
      }
    };
  };
}

const bidRequestWithMetadataHelper = new BidRequestWithMetadataHelper();
export default bidRequestWithMetadataHelper;
