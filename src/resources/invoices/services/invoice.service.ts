import "server-only";
import prisma from "@/utils/prisma";
import { $Enums, Prisma } from "@prisma/client";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { InvoicedOfferT, UninvoicedOfferT } from "@/resources/invoices/dtos/invoice.dto";
import offerHelper from "@/resources/offers/helpers/offer.helper";
import { getLocale } from "next-intl/server";
import webtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";
import WebtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";

class InvoiceService {
  async list(options: {
    page: number;
    isAdmin: boolean;
    mode: "uninvoiced";
  }): Promise<ListResponse<UninvoicedOfferT>>;

  async list(options: {
    page: number;
    isAdmin: boolean;
    mode: "invoiced";
  }): Promise<ListResponse<InvoicedOfferT>>;

  async list({
    page, isAdmin, mode
  }: {
    page: number;
    isAdmin: boolean;
    mode: "uninvoiced" | "invoiced";
  }): Promise<ListResponse<InvoicedOfferT|UninvoicedOfferT>> {
  // TODO join 최적화
  // https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview
  // where 절
    const where: Prisma.OfferProposalWhereInput = {
      status: $Enums.OfferProposalStatus.ACCEPTED,
    };
    if (mode === "invoiced"){
      where.invoice = {
        isNot: null
      };
    } else {
      where.invoice = {
        is: null
      };
    }
    if (isAdmin) {
      await getTokenInfo({
        admin: true
      });
    } else {
      where.offer = await offerHelper.whereWithReadAccess();
    }
    // 쿼리
    const limit = 5;
    const [records, totalRecords] = await prisma.$transaction([
      prisma.offerProposal.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          decidedAt: true,
          invoice: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true
            }
          },
          offer: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              },
              bidRound: {
                select: {
                  webtoon: {
                    select: {
                      ...webtoonPreviewHelper.query.select,
                      user: {
                        select: {
                          id: true,
                          name: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.offerProposal.count({ where }),
    ]);
    const locale = await getLocale();
    return {
      items: records.map(record => {
        const { offer, invoice } = record;
        const { webtoon } = offer.bidRound;
        const creatingUser = webtoon.user;
        const buyingUser = offer.user;

        return {
          invoice: invoice ?? undefined,
          offerProposal: {
            id: record.id,
            decidedAt: record.decidedAt ?? undefined,
          },
          webtoon: WebtoonPreviewHelper.mapToDTO(webtoon, locale),
          creator: {
            user: {
              id: creatingUser.id,
              name: creatingUser.name
            }
          },
          buyer: {
            user: {
              id: buyingUser.id,
              name: buyingUser.name
            }
          }
        };
      }),
      totalPages: Math.ceil(totalRecords / limit),
    };
  }
}
const invoiceService = new InvoiceService();
export default invoiceService;
