"use server";

import { Invoice as InvoiceRecord, Prisma } from "@prisma/client";
import { InvoiceContent, InvoiceExtendedT, InvoiceT } from "@/resources/invoices/invoice.types";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";
import prisma from "@/utils/prisma";
import { UserTypeT } from "@/resources/users/user.types";
import z from "zod";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.types";
import { BidRequestContractRangeItemSchema } from "@/resources/bidRequests/bidRequest.types";
import { convertInvoiceToHtml } from "@/resources/invoices/invoice.utils";

const mapToInvoiceDTO = (record: InvoiceRecord): InvoiceT => {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    bidRequestId: record.bidRequestId,
  };
};

export async function previewOrCreateInvoice(bidRequestId: number, storeToDb: boolean): Promise<string> {
  return prisma.$transaction(async (tx) => {
    const record = await tx.bidRequest.findUniqueOrThrow({
      where: { id: bidRequestId },
      select: {
        // 계약 조건
        contractRange: true,

        // 바이어
        user: {
          include: {
            buyer: {
              select: {
                id: true,
                company: true
              }
            }
          }
        },
        bidRound: {
          select: {
            // 웹툰
            webtoon: {
              select: {
                id: true,
                title: true,
                title_en: true,
                // 판매자
                user: {
                  include: {
                    creator: {
                      select: {
                        id: true,
                        name: true,
                        name_en: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // 레코드 분석
    const contractRange = z.array(BidRequestContractRangeItemSchema)
      .parse(record.contractRange);
    const { webtoon } = record.bidRound;
    const buyerUser = record.user;
    const buyerCompany = BuyerCompanySchema.parse(buyerUser.buyer?.company);
    const creatorUser = record.bidRound.webtoon.user;
    if (!buyerUser.buyer || !creatorUser.creator) {
      throw new Error("bidRequest not found");
    }

    // 컨텐츠 작성
    const invoiceContent: z.infer<typeof InvoiceContent> = {
      templateVersion: InvoiceContent.shape.templateVersion.value,
      buyer: {
        id: buyerUser.buyer.id,
        name: buyerCompany.name,
        businessNumber: buyerCompany.businessNumber,
        user: {
          id: buyerUser.id,
          name: buyerUser.name,
          addressLine1: buyerUser.addressLine1 || "", //todo db 컬럼 required로 변경
          addressLine2: buyerUser.addressLine2 || "",
          phone: buyerUser.phone
        }
      },
      creator: {
        id: creatorUser.creator.id,
        name: creatorUser.creator.name,
        name_en: creatorUser.creator.name_en ?? undefined,
        user: {
          id: creatorUser.id,
          name: creatorUser.name,
          addressLine1: creatorUser.addressLine1 || "", //todo db 컬럼 required로 변경
          addressLine2: creatorUser.addressLine2 || "",
          phone: creatorUser.phone
        }
      },
      webtoon: {
        id: webtoon.id,
        title: webtoon.title,
        title_en: webtoon.title_en
      },
      bidRequest: {
        id: bidRequestId,
        contractRange
      },
      issuedAt: new Date()
    };

    const invoiceContentValidated = InvoiceContent.parse(invoiceContent);
    const contentInHtml = await convertInvoiceToHtml(invoiceContentValidated);

    if (storeToDb) {
      await tx.invoice.create({
        data: {
          bidRequestId,
          content: invoiceContentValidated,
          contentInHtml
        }
      });
    }
    return contentInHtml;
  });
}

export async function listInvoices({
  page = 1,
  limit = 5,
  isAdmin = false,
}: {
  page?: number;
  limit?: number;
  isAdmin?: boolean;
} = {}): Promise<ListResponse<InvoiceExtendedT>> {
  // TODO join 최적화
  // https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview
  const { userId, metadata } = await getTokenInfo();
  const where: Prisma.InvoiceWhereInput = {
    bidRequest: {
      userId: metadata.type === UserTypeT.Buyer ? userId : undefined,
      bidRound: metadata.type === UserTypeT.Creator ? {
        webtoon: {
          userId: userId
        }
      } : undefined
    }
  };
  const [records, totalRecords] = await prisma.$transaction([
    prisma.invoice.findMany({
      where: isAdmin ? undefined : where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        bidRequest: {
          select: {
            userId: true,
            user: {
              select: {
                name: true
              }
            },
            bidRound: {
              select: {
                webtoon: {
                  select: {
                    id: true,
                    title: true,
                    title_en: true,
                    thumbPath: true,
                    userId: true,
                    user: {
                      select: {
                        name: true
                      }
                    }
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
  return {
    items: records.map(record => {
      const { bidRequest } = record;
      const { webtoon } = bidRequest.bidRound;

      return {
        ...mapToInvoiceDTO(record),
        webtoon: {
          id: webtoon.id,
          title: webtoon.title,
          title_en: webtoon.title_en ?? undefined,
          thumbPath: webtoon.thumbPath
        },
        creatorUsername: webtoon.user.name,
        buyerUsername: bidRequest.user.name,
      };
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function downloadInvoiceContent(invoiceId: number) {
  // TODO content, contentInHtml 장단점 문서화
  const { contentInHtml } = await prisma.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
    select: {
      contentInHtml: true
    }
  });
  return contentInHtml;
  // return convertHtmlToPdfBuffer(contentInHtml);
}
