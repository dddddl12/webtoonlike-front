import prisma from "@/utils/prisma";
import z from "zod";
import { BidRequestContractRangeItemSchema } from "@/resources/bidRequests/dtos/bidRequest.dto";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.dto";
import { convertInvoiceToHtml } from "@/resources/invoices/helpers/invoiceContent.helper";
import { InvoiceContent } from "@/resources/invoices/dtos/invoiceContent.dto";

class InvoiceContentService {
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

const invoiceContentService = new InvoiceContentService();
export default invoiceContentService;