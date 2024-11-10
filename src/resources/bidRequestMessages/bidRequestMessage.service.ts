"use server";

import { BidRequestMessage as BidRequestMessageRecord, Prisma } from "@prisma/client";
import { BidRequestMessageExtendedT, BidRequestMessageT } from "@/resources/bidRequestMessages/bidRequestMessage.types";
import prisma from "@/utils/prisma";
import { UserTypeT } from "@/resources/users/user.types";
import { ListResponse } from "@/resources/globalTypes";

const mapToBidRequestMessageDTO = (record: BidRequestMessageRecord): BidRequestMessageT => ({
  id: record.id,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  bidRequestId: record.bidRequestId,
  content: record.content
});

export async function listBidRequestMessages(bidRequestId: number, {
  page = 1,
  limit = 10
} = {}): Promise<ListResponse<BidRequestMessageExtendedT>> {
  const where: Prisma.BidRequestMessageWhereInput = {
    bidRequestId
  };

  const [records, totalRecords] = await prisma.$transaction([
    prisma.bidRequestMessage.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            userType: true
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.bidRequestMessage.count({ where })
  ]);
  return {
    items: records.map(record => {
      const { user } = record;
      return {
        ...mapToBidRequestMessageDTO(record),
        user: {
          id: user.id,
          userType: user.userType as UserTypeT,
          name: user.name
        }
      };
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };
}