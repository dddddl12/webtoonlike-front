import "server-only";
import { getTokenInfo } from "@/resources/tokens/token.service";
import prisma from "@/utils/prisma";
import {
  OfferWithBuyerAndWebtoonT,
  OfferWithActiveProposalT
} from "@/resources/offers/dtos/offer.dto";
import { getLocale } from "next-intl/server";
import offerHelper from "@/resources/offers/helpers/offer.helper";
import { ListResponse } from "@/resources/globalTypes";
import authorizeOfferAccess from "@/resources/offers/offer.authorization";


class OfferService {

  // 관리자 화면 오퍼 > 특정 웹툰 클릭
  async listByBidRoundId(bidRoundId: number): Promise<OfferWithActiveProposalT[]> {
    await getTokenInfo({
      admin: true
    });
    const records = await prisma.offer.findMany({
      where: {
        bidRoundId
      },
      ...offerHelper.withBuyerQuery,
      orderBy: {
        createdAt: "desc"
      }
    });
    return records.map(offerHelper.withBuyerMapToDTO);
  }

  // 오퍼 관리
  async getOffer(offerId: number): Promise<OfferWithBuyerAndWebtoonT> {
    const r = await prisma.$transaction(async (tx) => {
      await authorizeOfferAccess(tx, offerId);
      return tx.offer.findUniqueOrThrow({
        ...offerHelper.withBuyerAndWebtoonQuery,
        where: {
          id: offerId
        }
      });
    });
    const locale = await getLocale();
    return offerHelper.withBuyerAndWebtoonMapToDTO(r, locale);
  }

  async listMyOffers(
    {
      page,
      limit
    }: {
      page: number;
      limit: number;
    }
  ): Promise<ListResponse<OfferWithBuyerAndWebtoonT>> {
    const where = await offerHelper.whereWithReadAccess();
    const [records, totalRecords] = await prisma.$transaction([
      prisma.offer.findMany({
        ...offerHelper.withBuyerAndWebtoonQuery,
        where,
        orderBy: {
          createdAt: "desc"
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.offer.count({ where })
    ]);

    const locale = await getLocale();
    return {
      items: records.map(r => offerHelper.withBuyerAndWebtoonMapToDTO(r, locale)),
      totalPages: Math.ceil(totalRecords / limit),
    };
  }
}

const offerService = new OfferService();
export default offerService;