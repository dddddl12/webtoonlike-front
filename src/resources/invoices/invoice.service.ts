"use server";

import { Prisma } from "@prisma/client";
import { InvoiceContent, InvoiceContentT, InvoiceSchema } from "@/resources/invoices/invoice.types";
import { ListResponse, ListResponseSchema } from "@/resources/globalTypes";
import { assertAdmin, getTokenInfo } from "@/resources/tokens/token.service";
import prisma from "@/utils/prisma";
import { UserTypeT } from "@/resources/users/user.types";
import z from "zod";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.types";
import { BidRequestContractRangeItemSchema } from "@/resources/bidRequests/bidRequest.types";
import { convertInvoiceToHtml } from "@/resources/invoices/invoice.utils";
import { action } from "@/handlers/safeAction";

export const previewInvoice = action
  .metadata({ actionName: "previewInvoice" })
  .bindArgsSchemas([
    z.number() //bidRequestId
  ])
  .outputSchema(z.string())
  .action(async ({ bindArgsParsedInputs: [bidRequestId] }) => {
    return _previewOrCreateInvoice(
      bidRequestId,
      false
    );
  });

export const createInvoice = action
  .metadata({ actionName: "createInvoice" })
  .bindArgsSchemas([
    z.number() //bidRequestId
  ])
  .outputSchema(z.string())
  .action(async ({ bindArgsParsedInputs: [bidRequestId] }) => {
    return _previewOrCreateInvoice(
      bidRequestId,
      true
    );
  });

async function _previewOrCreateInvoice(bidRequestId: number, storeToDb: boolean): Promise<string> {
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
    if (storeToDb) {
      await tx.invoice.create({
        data: {
          bidRequestId,
          content: invoiceContentValidated
        }
      });
    }
    return convertInvoiceToHtml(invoiceContentValidated);
  });
}

const InvoiceWithWebtoonSchema = InvoiceSchema
  .extend({
    webtoon: z.object({
      id: z.number(),
      title: z.string(),
      title_en: z.string().optional(),
      thumbPath: z.string()
    }),
    creatorUsername: z.string(),
    buyerUsername: z.string()
  });
export type InvoiceWithWebtoonT = z.infer<typeof InvoiceWithWebtoonSchema>;

export const adminListInvoices = action
  .metadata({ actionName: "adminListInvoices" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(InvoiceWithWebtoonSchema))
  .action(async ({
    parsedInput: filters
  }) => {
    return _listInvoices({
      ...filters,
      isAdmin: true
    });
  });

export const listInvoices = action
  .metadata({ actionName: "listInvoices" })
  .schema(z.object({
    page: z.number().default(1),
  }))
  .outputSchema(ListResponseSchema(InvoiceWithWebtoonSchema))
  .action(async ({
    parsedInput: filters
  }) => {
    return _listInvoices({
      ...filters,
      isAdmin: false
    });
  });

async function _listInvoices({
  page = 1,
  isAdmin = false,
}: {
  page?: number;
  isAdmin?: boolean;
} = {}): Promise<ListResponse<InvoiceWithWebtoonT>> {
  // TODO join 최적화
  // https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview
  if (isAdmin) {
    await assertAdmin();
  }
  const limit = 5;
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
        id: record.id,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        bidRequestId: record.bidRequestId,
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

export const downloadInvoiceContent = action
  .metadata({ actionName: "downloadInvoiceContent" })
  .bindArgsSchemas([
    z.number() // invoiceId
  ])
  .outputSchema(z.string())
  .action(async ({ bindArgsParsedInputs: [invoiceId] }) => {
    const { content } = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoiceId },
      select: {
        content: true
      }
    });
    return convertInvoiceToHtml(InvoiceContent.parse(content));
  });
