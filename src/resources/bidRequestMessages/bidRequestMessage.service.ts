"use server";

import {
  BidRequestMessageT
} from "@/resources/bidRequestMessages/bidRequestMessage.types";
import prisma from "@/utils/prisma";
import { UserTypeT } from "@/resources/users/user.types";
import { getTokenInfo } from "@/resources/tokens/token.service";

export type BidRequestMessagesResponse = {
  messages: (BidRequestMessageT & {
    user: {
      id: number;
      name: string;
      userType: UserTypeT;
    };
  })[];
  invoice?: {
    id: number;
    createdAt: Date;
  };
};

export async function listBidRequestMessages(bidRequestId: number): Promise<BidRequestMessagesResponse> {
  const [records, invoiceRecord] = await prisma.$transaction([
    prisma.bidRequestMessage.findMany({
      where: {
        bidRequestId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            userType: true
          }
        },
        bidRequest: {
          select: {
            invoice: {
              select: {
                id: true,
                createdAt: true
              }
            }
          }
        }
      }
    }),
    prisma.invoice.findUnique({
      where: { bidRequestId }
    })
  ]);
  const bidRequestMessagesResponse: BidRequestMessagesResponse = {
    messages: records.map(record => {
      const { user } = record;
      return {
        id: record.id,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        bidRequestId: record.bidRequestId,
        content: record.content,
        user: {
          id: user.id,
          userType: user.userType as UserTypeT,
          name: user.name
        }
      };
    })
  };
  if (invoiceRecord){
    bidRequestMessagesResponse.invoice = {
      id: invoiceRecord.id,
      createdAt: invoiceRecord.createdAt,
    };
  }
  return bidRequestMessagesResponse;
}

export async function createBidRequestMessage(bidRequestId: number, content: string) {
  const { userId } = await getTokenInfo();
  await prisma.bidRequestMessage.create({
    data: {
      bidRequestId,
      content,
      userId
    }
  });
}