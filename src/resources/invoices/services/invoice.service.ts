import "server-only";
import prisma from "@/utils/prisma";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { InvoiceWithWebtoonT } from "@/resources/invoices/dtos/invoice.dto";
import bidRequestHelper from "@/resources/bidRequests/helpers/bidRequest.helper";
import { getLocale } from "next-intl/server";
import { displayName } from "@/resources/displayName";

class InvoiceService {
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
    const bidRequestWhere = await bidRequestHelper.whereWithReadAccess();
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
    const locale = await getLocale();
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
            thumbPath: webtoon.thumbPath,
            localized: {
              title: displayName(locale, webtoon.title, webtoon.title_en),
            }
          },
          creatorUsername: webtoon.user.name,
          buyerUsername: bidRequest.user.name,
        };
      }),
      totalPages: Math.ceil(totalRecords / limit),
    };
  }
}
const invoiceService = new InvoiceService();
export default invoiceService;