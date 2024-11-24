import "server-only";
import { Prisma } from "@prisma/client";
import { AdminPageBidRoundT } from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import bidRoundHelper from "@/resources/bidRounds/helpers/bidRound.helper";
import webtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";

class BidRoundAdminHelper {
  query = Prisma.validator<Prisma.BidRoundDefaultArgs>()({
    include: {
      webtoon: {
        select: {
          ...webtoonPreviewHelper.query.select,
          user: {
            select: {
              name: true,
            }
          },
        }
      }
    }
  });

  mapToDTO = (
    record: Prisma.BidRoundGetPayload<typeof this.query>,
    locale: string,
  ): AdminPageBidRoundT => {
    const status = bidRoundHelper.getStatusFromRecord(record);
    return {
      id: record.id,
      createdAt: record.createdAt,
      status,
      adminSettings: {
        bidStartsAt: record.bidStartsAt ?? undefined,
        negoStartsAt: record.negoStartsAt ?? undefined,
        processEndsAt: record.processEndsAt ?? undefined,
        adminNote: record.adminNote ?? undefined,
      },
      webtoon: webtoonPreviewHelper.mapToDTO(record.webtoon, locale),
      creator: {
        user: {
          name: record.webtoon.user.name,
        }
      }
    };
  };
}

const bidRoundAdminHelper = new BidRoundAdminHelper();
export default bidRoundAdminHelper;
