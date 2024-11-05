"use server";

import { BidRequest as BidRequestRecord, Prisma } from "@prisma/client";
import { BidRequestExtendedT, BidRequestSchema, BidRequestT } from "@/resources/bidRequests/bidRequest.types";
import prisma from "@/utils/prisma";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";


const mapToBidRequestDTO = (record: BidRequestRecord): BidRequestT => ({
  id: record.id,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  bidRoundId: record.bidRoundId,
  message: record.message ?? undefined,
  contractRange: BidRequestSchema.shape.contractRange
    .safeParse(record.contractRange).data ?? [],
  userId: record.userId ?? undefined,
  acceptedAt: record.acceptedAt ?? undefined,
  rejectedAt: record.rejectedAt ?? undefined,
  approvedAt: record.approvedAt ?? undefined,
  cancelledAt: record.cancelledAt ?? undefined,
});

export async function listBidRequests({
  page = 1,
  limit = 10
}: {
  page?: number;
  limit?: number;
} = {}): Promise<ListResponse<BidRequestExtendedT>> {
  const { userId } = await getTokenInfo();

  const where: Prisma.BidRequestWhereInput = {
    // userId
  //   TODO
  };

  const [records, totalRecords] = await prisma.$transaction([
    prisma.bidRequest.findMany({
      where,
      include: {
        bidRound: {
          select: {
            webtoon: {
              select: {
                id: true,
                title: true,
                title_en: true,
                thumbPath: true,
              }
            }
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.bidRequest.count({ where })
  ]);
  return {
    items: records.map(record => {
      const { webtoon } = record.bidRound;
      return {
        ...mapToBidRequestDTO(record),
        webtoon: {
          id: webtoon.id,
          title: webtoon.title,
          title_en: webtoon.title_en ?? undefined,
          thumbPath: webtoon.thumbPath,
        }
      };
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };

}