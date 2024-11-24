import "server-only";
import { Prisma } from "@prisma/client";
import { UnexpectedServerError } from "@/handlers/errors";
import { getClerkUserMap, getTokenInfo } from "@/resources/tokens/token.service";
import prisma from "@/utils/prisma";
import { BidRequestDetailsT, BidRequestFormT } from "@/resources/bidRequests/dtos/bidRequest.dto";
import { BuyerCompanySchema } from "@/resources/buyers/buyer.dto";
import { getLocale } from "next-intl/server";
import webtoonDetailsHelper from "@/resources/webtoons/helpers/webtoonDetails.helper";
import bidRequestHelper from "@/resources/bidRequests/helpers/bidRequest.helper";
import { displayName } from "@/resources/displayName";


class BidRequestService {
  async create(bidRoundId: number, formData: BidRequestFormT) {
    const { userId } = await getTokenInfo({
      buyer: true,
    });
    const insertData: Prisma.BidRequestCreateInput = {
      message: formData.message,
      contractRange: formData.contractRange,
      user: {
        connect: {
          id: userId
        }
      },
      bidRound: {
        connect: {
          id: bidRoundId
        }
      }
    };
    await prisma.bidRequest.create({
      data: insertData
    });
  }

  async getDetails(bidRequestId: number): Promise<BidRequestDetailsT> {
    const where = await bidRequestHelper.whereWithReadAccess(bidRequestId);
    const r = await prisma.bidRequest.findUniqueOrThrow({
      where: where,
      include: {
        // 인보이스
        invoice: {
          select: {
            id: true,
          }
        },
        // 바이어
        user: {
          select: {
            sub: true,
            name: true,
            phone: true,
            email: true,
            // TODO 전반적으로 buyer 정보가 한 컬럼에 몰려있는 건 위험이 있음
            buyer: {
              select: {
                company: true,
              }
            },
          }
        },
        bidRound: {
          select: {
          // 웹툰
            isNew: true,
            totalEpisodeCount: true,
            currentEpisodeNo: true,
            webtoon: {
              include: {
                ...webtoonDetailsHelper.query.include,
                // 저작권자
                user: {
                  select: {
                    sub: true,
                    name: true,
                    phone: true,
                    email: true,
                    creator: {
                      select: {
                        name: true,
                        name_en: true,
                        isAgencyAffiliated: true,
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
    const isInvoiced = !!r.invoice;
    const { user: buyerUser, bidRound } = r;
    const { webtoon } = bidRound;
    const { user: creatorUser } = webtoon;
    const clerkUserMap = await getClerkUserMap([buyerUser.sub, creatorUser.sub]);
    const buyerCompany = BuyerCompanySchema.parse(buyerUser.buyer?.company);

    // 바이어 정보 기입
    const buyerClerkUser = clerkUserMap.get(buyerUser.sub);
    const buyerDto: BidRequestDetailsT["buyer"] = {
      name: buyerCompany.name,
      dept: buyerCompany.dept,
      position: buyerCompany.position,
      user: {
        name: buyerUser.name,
        thumbPath: buyerClerkUser?.imageUrl,
        // 아래 정보는 인보이스 기발급 시에만 노출
        phone: isInvoiced ? buyerUser.phone : undefined,
        email: isInvoiced ? buyerUser.email : undefined
      }
    };

    const locale = await getLocale();

    // 저작권자 정보 기입
    if (!creatorUser.creator) {
      throw new UnexpectedServerError("creatorUser.creator is undefined");
    }
    const creatorClerkUser = clerkUserMap.get(creatorUser.sub);
    const creatorDto: BidRequestDetailsT["creator"] = {
      isAgencyAffiliated: creatorUser.creator.isAgencyAffiliated,
      localized: {
        name: displayName(
          locale, creatorUser.creator.name, creatorUser.creator.name_en)
      },
      user: {
        name: creatorUser.name,
        thumbPath: creatorClerkUser?.imageUrl,
        // 아래 정보는 인보이스 기발급 시에만 노출
        phone: isInvoiced ? creatorUser.phone : undefined,
        email: isInvoiced ? creatorUser.email : undefined
      }
    };

    return {
      ...bidRequestHelper.mapToDTO(r),
      webtoon: {
        ...webtoonDetailsHelper.mapToDTO(webtoon, locale),
        activeBidRound: {
          isNew: bidRound.isNew,
          currentEpisodeNo: bidRound.currentEpisodeNo ?? undefined,
          totalEpisodeCount: bidRound.totalEpisodeCount ?? undefined,
        }
      },
      creator: creatorDto,
      buyer: buyerDto
    };
  }
}

const bidRequestService = new BidRequestService();
export default bidRequestService;