import "server-only";
import prisma from "@/utils/prisma";
import z from "zod";
import { convertInvoiceToHtml } from "@/resources/invoices/helpers/invoiceContent.helper";
import { InvoiceContent } from "@/resources/invoices/dtos/invoiceContent.dto";
import OfferProposalHelper from "@/resources/offers/helpers/offerProposal.helper";
import { getTokenInfo } from "@/resources/tokens/token.service";

class InvoiceContentService {
  async previewOrCreateInvoice(offerProposalId: number, storeToDb: boolean) {
    return prisma.$transaction(async (tx) => {
      const record = await tx.offerProposal.findUniqueOrThrow({
        where: { id: offerProposalId },
        include: {
          offer: {
            select: {
              // 바이어
              user: {
                include: {
                  buyer: {
                    select: {
                      id: true,
                      name: true,
                      businessNumber: true
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
          },
        }
      });

      // 레코드 분석
      const { webtoon } = record.offer.bidRound;
      const buyerUser = record.offer.user;
      const creatorUser = record.offer.bidRound.webtoon.user;
      if (!buyerUser.buyer || !creatorUser.creator) {
        throw new Error("Offer not found");
      }

      // 컨텐츠 작성
      const invoiceContent: z.infer<typeof InvoiceContent> = {
        templateVersion: InvoiceContent.shape.templateVersion.value,
        buyer: {
          id: buyerUser.buyer.id,
          name: buyerUser.buyer.name,
          businessNumber: buyerUser.buyer.businessNumber,
          user: {
            id: buyerUser.id,
            name: buyerUser.name,
            addressLine1: buyerUser.addressLine1,
            addressLine2: buyerUser.addressLine2,
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
            addressLine1: creatorUser.addressLine1,
            addressLine2: creatorUser.addressLine2,
            phone: creatorUser.phone
          }
        },
        webtoon: {
          id: webtoon.id,
          title: webtoon.title,
          title_en: webtoon.title_en
        },
        offerProposal: OfferProposalHelper.mapToDTO(record),
        issuedAt: new Date()
      };

      const invoiceContentValidated = InvoiceContent.parse(invoiceContent);
      if (storeToDb) {
        const { userId } = await getTokenInfo({
          admin: true,
        });
        await tx.invoice.create({
          data: {
            offerProposal: {
              connect: {
                id: offerProposalId
              }
            },
            user: {
              connect: {
                id: userId
              }
            },
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