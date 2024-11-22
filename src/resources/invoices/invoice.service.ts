import "server-only";
import prisma from "@/utils/prisma";
import z from "zod";
import { BidRequestContractRangeItemSchema } from "@/resources/bidRequests/bidRequest.types";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.types";
import { InvoiceContent } from "@/resources/invoices/invoice.types";
import { convertInvoiceToHtml } from "@/resources/invoices/invoice.utils";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { InvoiceWithWebtoonT } from "@/resources/invoices/invoice.controller";
import bidRequestService from "@/resources/bidRequests/bidRequest.service";

class InvoiceService {
  async previewOrCreateInvoice(bidRequestId: number, storeToDb: boolean) {
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

  async list({
    page = 1,
    isAdmin = false,
  }: {
    page?: number;
    isAdmin?: boolean;
  } = {}): Promise<ListResponse<InvoiceWithWebtoonT>> {
  // TODO join 최적화
  // https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview
    if (isAdmin) {
      await getTokenInfo({
        admin: true
      });
    }
    const bidRequestWhere = await bidRequestService.whereWithReadAccess();
    const where = {
      bidRequest: bidRequestWhere
    };
    const limit = 5;
    const [records, totalRecords] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
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
  async download(invoiceId: number) {
    const { content } = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoiceId },
      select: {
        content: true
      }
    });
    return convertInvoiceToHtml(InvoiceContent.parse(content));
  }
}
const invoiceService = new InvoiceService();
export default invoiceService;