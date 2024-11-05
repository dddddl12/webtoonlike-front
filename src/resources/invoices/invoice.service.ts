"use server";

import { Invoice as InvoiceRecord, Prisma } from "@prisma/client";
import { InvoiceExtendedT, InvoiceT } from "@/resources/invoices/invoice.types";
import { ListResponse } from "@/resources/globalTypes";
import { getClerkUserMap, getUserMetadata } from "@/resources/userMetadata/userMetadata.service";
import prisma from "@/utils/prisma";
import { UserTypeT } from "@/resources/users/user.types";

const mapToInvoiceDTO = (record: InvoiceRecord): InvoiceT => {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    bidRequestId: record.bidRequestId,
  };
};

export async function listInvoices({
  page = 1,
  limit = 10
}: {
  page?: number;
  limit?: number;
} = {}): Promise<ListResponse<InvoiceExtendedT>> {
  // TODO join 최적화
  // https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview
  const UserMetadata = await getUserMetadata();
  const where: Prisma.InvoiceWhereInput = {
    bidRequest: {
      userId: UserMetadata.type === UserTypeT.Buyer ? UserMetadata.id : undefined,
      bidRound: UserMetadata.type === UserTypeT.Creator ? {
        webtoon: {
          userId: UserMetadata.id
        }
      } : undefined
    }
  };
  const [records, totalRecords] = await prisma.$transaction([
    prisma.invoice.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        bidRequest: {
          select: {
            userId: true,
            bidRound: {
              select: {
                webtoon: {
                  select: {
                    id: true,
                    title: true,
                    title_en: true,
                    thumbPath: true,
                    userId: true,
                  }
                }
              }
            }
          }
        },
      }
    }),
    prisma.invoice.count({ where }),
  ]);
  const creatorIds = records.map(record => record.bidRequest.bidRound.webtoon.userId);
  const buyerIds = records.map(record => record.bidRequest.userId);
  const clerkUserMap = await getClerkUserMap([...creatorIds, ...buyerIds]);

  return {
    items: records.map(record => {
      const { bidRequest } = record;
      const { webtoon } = bidRequest.bidRound;
      const creator = clerkUserMap.get(record.bidRequest.bidRound.webtoon.userId);
      const buyer = clerkUserMap.get(record.bidRequest.userId);

      return {
        ...mapToInvoiceDTO(record),
        webtoon: {
          id: webtoon.id,
          title: webtoon.title,
          title_en: webtoon.title_en ?? undefined,
          thumbPath: webtoon.thumbPath
        },
        creatorUsername: creator?.username || "Unknown",
        // TODO 클라에서 가입 상태에 따라 다르게 표현해야 할 수 있음
        buyerUsername: buyer?.username || "Unknown",
      };
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };

}