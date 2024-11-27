import "server-only";
import { Offer as OfferRecord, Prisma, $Enums } from "@prisma/client";
import { OfferT, OfferWithBuyerAndWebtoonT, OfferWithActiveProposalT } from "@/resources/offers/dtos/offer.dto";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { UnexpectedServerError } from "@/handlers/errors";
import webtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";
import WebtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";
import offerProposalHelper from "@/resources/offers/helpers/offerProposal.helper";

class OfferHelper {
  mapToDTO = (record: OfferRecord): OfferT => {
    return {
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      bidRoundId: record.bidRoundId,
      userId: record.userId,
    };
  };

  withBuyerQuery = Prisma.validator<Prisma.OfferDefaultArgs>()({
    include: {
      offerProposals: {
        where: {
          status: {
            not: $Enums.OfferProposalStatus.SUPERSEDED
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
        }
      },
    }
  });

  withBuyerMapToDTO = (
    r: Prisma.OfferGetPayload<typeof this.withBuyerQuery>
  ): OfferWithActiveProposalT => {
    const buyingUser = r.user;
    return {
      ...offerHelper.mapToDTO(r),
      activeOfferProposal: offerProposalHelper.mapToDTO(r.offerProposals[0]),
      buyer: {
        user: {
          id: buyingUser.id,
          name: buyingUser.name
        }
      }
    };
  };

  withBuyerAndWebtoonQuery = Prisma.validator<Prisma.OfferDefaultArgs>()({
    include: {
      ...this.withBuyerQuery.include,
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
      }
    }
  });

  withBuyerAndWebtoonMapToDTO = (
    r: Prisma.OfferGetPayload<typeof this.withBuyerAndWebtoonQuery>,
    locale: string
  ): OfferWithBuyerAndWebtoonT => {
    const { webtoon } = r.bidRound;
    const creatingUser = webtoon.user;

    if (!creatingUser) {
      throw new UnexpectedServerError("Creating user or buying user is not found");
    }

    return {
      ...this.withBuyerMapToDTO(r),
      webtoon: WebtoonPreviewHelper.mapToDTO(webtoon, locale),
      creator: {
        user: {
          id: creatingUser.id,
          name: creatingUser.name
        }
      }
    };
  };

  async whereWithReadAccess(): Promise<Prisma.OfferWhereInput> {
    const where: Prisma.OfferWhereInput = {};
    const { userId, metadata } = await getTokenInfo();
    if (metadata.type === UserTypeT.Creator) {
      where.bidRound = {
        webtoon: {
          userId
        }
      };
    } else if (metadata.type === UserTypeT.Buyer) {
      where.userId = userId;
    } else {
      throw new UnexpectedServerError();
    }
    return where;
  };
}

const offerHelper = new OfferHelper();
export default offerHelper;