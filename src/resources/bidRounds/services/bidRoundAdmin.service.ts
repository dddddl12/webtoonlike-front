import "server-only";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { $Enums, Prisma } from "@prisma/client";
import prisma from "@/utils/prisma";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import { AdminPageBidRoundFilterT } from "@/resources/bidRounds/controllers/bidRoundAdmin.controller";
import {
  AdminPageBidRoundT,
  AdminPageBidRoundWithOffersT,
  StrictBidRoundAdminSettingsT
} from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import bidRoundAdminHelper from "@/resources/bidRounds/helpers/bidRoundAdmin.helper";
import { ListResponse } from "@/resources/globalTypes";
import { getLocale } from "next-intl/server";
import bidRoundHelper from "@/resources/bidRounds/helpers/bidRound.helper";

class BidRoundAdminService {
  async adminListBidRoundsWithWebtoon({
    page, approvalStatus
  }: AdminPageBidRoundFilterT): Promise<ListResponse<AdminPageBidRoundT>> {
    await getTokenInfo({
      admin: true,
    });
    const limit = 5;
    const where: Prisma.BidRoundWhereInput = {
      approvalStatus: approvalStatus as $Enums.BidRoundApprovalStatus,
      isActive: true,
    };
    const [records, totalRecords] = await prisma.$transaction([
      prisma.bidRound.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
        ...bidRoundAdminHelper.query
      }),
      prisma.bidRound.count({ where })
    ]);

    const locale = await getLocale();
    return {
      items: records.map(r => bidRoundAdminHelper.mapToDTO(r, locale)),
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  async adminListBidRoundsWithOffers({ page }: {
    page: number;
  }): Promise<ListResponse<AdminPageBidRoundWithOffersT>> {
    await getTokenInfo({
      admin: true,
    });
    const limit = 5;
    const where = bidRoundHelper.offerableBidRoundWhere();
    const [records, totalRecords] = await prisma.$transaction([
      prisma.bidRound.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
        include: {
          ...bidRoundAdminHelper.query.include,
          _count: {
            select: {
              offers: true,
            }
          }
        }
      }),
      prisma.bidRound.count({ where })
    ]);
    const locale = await getLocale();
    const items: AdminPageBidRoundWithOffersT[] = records.map(r => ({
      offerCount: r._count.offers,
      ...bidRoundAdminHelper.mapToDTO(r, locale)
    }));
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async approve(bidRoundId: number) {
    await getTokenInfo({
      admin: true,
    });
    await prisma.bidRound.update({
      where: {
        id: bidRoundId
      },
      data: {
        approvalStatus: BidRoundApprovalStatus.Approved,
        approvalDecidedAt: new Date(),
      }
    });
  }

  async disapprove(bidRoundId: number) {
    await getTokenInfo({
      admin: true,
    });
    await prisma.bidRound.update({
      where: {
        id: bidRoundId
      },
      data: {
        approvalStatus: BidRoundApprovalStatus.Disapproved,
        approvalDecidedAt: new Date(),
      }
    });
  }

  async getBidRoundAdminSettings(bidRoundId: number) {
    await getTokenInfo({
      admin: true,
    });
    const r = await prisma.bidRound.findUniqueOrThrow({
      where: {
        id: bidRoundId
      },
      ...bidRoundAdminHelper.query
    });
    const locale = await getLocale();
    return bidRoundAdminHelper.mapToDTO(r, locale)
      .adminSettings;
  }

  async editBidRoundAdminSettings(bidRoundId: number, settings: StrictBidRoundAdminSettingsT) {
    await getTokenInfo({
      admin: true,
    });
    await prisma.bidRound.update({
      where: {
        id: bidRoundId
      },
      data: settings
    });
  }
}

const bidRoundAdminService = new BidRoundAdminService();
export default bidRoundAdminService;
