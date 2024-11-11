"use server";

import { BidRequest as BidRequestRecord, Prisma } from "@prisma/client";
import {
  BidRequestExtendedT, BidRequestFormSchema,
  BidRequestFormT,
  BidRequestSchema,
  BidRequestT
} from "@/resources/bidRequests/bidRequest.types";
import prisma from "@/utils/prisma";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";

// const getBidRequestStatus = (record: BidRequestRecord): string => {
//   const { approvedAt, acceptedAt, cancelledAt, rejectedAt } = record;
//   if (approvedAt && approvedAt > now) {}
// }

const mapToBidRequestDTO = (record: BidRequestRecord): BidRequestT => {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    bidRoundId: record.bidRoundId,
    message: record.message ?? undefined,
    contractRange: BidRequestSchema.shape.contractRange
      .safeParse(record.contractRange).data ?? [],
    userId: record.userId ?? undefined,
    // status: record.approvedAt
    //   ? "오퍼 승인"
    //   : record.acceptedAt
    //     ? "오퍼 수락"
    //     : record.cancelledAt
    //       ? "오퍼 취소"
    //       : record.rejectedAt
    //         ? "오퍼 거절"
    //         : "진행 중"
  };
};

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
        },
        user: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
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
        },
        username: record.user.name,
      };
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };
}


export async function createBidRequest(form: BidRequestFormT) {
  const { userId } = await getTokenInfo();
  form = BidRequestFormSchema.parse(form);
  await prisma.bidRequest.create({
    data: {
      bidRoundId: form.bidRoundId,
      message: form.message,
      contractRange: form.contractRange,
      userId,
    }
  });
}