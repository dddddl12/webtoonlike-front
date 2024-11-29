import "server-only";
import { getClerkUserMap, getTokenInfo } from "@/resources/tokens/token.service";
import prisma from "@/utils/prisma";
import {
  changeOfferStatusParamsT, OfferDetailsT, OfferProposalDetailsT,
  OfferProposalFormT, OfferProposalListT,
  OfferProposalStatus
} from "@/resources/offers/dtos/offerProposal.dto";
import { $Enums } from "@prisma/client";
import offerProposalHelper from "@/resources/offers/helpers/offerProposal.helper";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import offerUserHelper from "@/resources/offers/helpers/offerUser.helper";
import webtoonDetailsHelper from "@/resources/webtoons/helpers/webtoonDetails.helper";
import { getLocale } from "next-intl/server";

class OfferProposalService {
  async create(offerId: number, refOfferProposalId: number, formData: OfferProposalFormT) {
    return prisma.$transaction(async (tx) => {
      // authorize 및 기타 적합성 확인
      await offerProposalHelper.checkForValidAction(tx, refOfferProposalId);
      await tx.offerProposal.updateMany({
        where: {
          offerId,
          status: OfferProposalStatus.Pending
        },
        data: {
          status: OfferProposalStatus.Superseded
        }
      });
      await offerProposalHelper.createOfferProposal(
        tx, offerId, formData);
    });
  }

  async createFromScratch(bidRoundId: number, formData: OfferProposalFormT) {
    const { userId } = await getTokenInfo({
      buyer: true,
    });
    return prisma.$transaction(async (tx) => {
      const offer = await tx.offer.create({
        data: {
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
        }
      });
      await offerProposalHelper.createOfferProposal(
        tx, offer.id, formData);
    });
  }

  async changeStatus(
    offerProposalId: number,
    { changeTo }: changeOfferStatusParamsT
  ) {
    await prisma.$transaction(async (tx) => {
      // authorize 및 기타 적합성 확인
      await offerProposalHelper.checkForValidAction(tx, offerProposalId);
      await tx.offerProposal.update({
        data: {
          status: changeTo === OfferProposalStatus.Accepted
            ? $Enums.OfferProposalStatus.ACCEPTED
            : $Enums.OfferProposalStatus.DECLINED,
          decidedAt: new Date()
        },
        where: {
          id: offerProposalId,
        },
      });
    });
  }

  async list(offerId: number): Promise<OfferProposalListT> {
    return prisma.$transaction(async (tx) => {
      // 리스트 출력
      const items = await tx.offerProposal.findMany({
        where: {
          offerId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              userType: true
            }
          }
        }
      });
      const offerProposalList: OfferProposalListT = {
        proposals: items.map(record => ({
          ...offerProposalHelper.mapToDTO(record),
          user: {
            id: record.user.id,
            userType: record.user.userType as UserTypeT,
            name: record.user.name
          }
        }))
      };
      // 인보이스 정보 추가
      const acceptedProposal = items.find(item => item.status === OfferProposalStatus.Accepted);
      if (acceptedProposal){
        const invoice = await tx.invoice.findUnique({
          where: { offerProposalId: acceptedProposal.id },
        });
        if (invoice) {
          offerProposalList.invoice = {
            id: invoice.id,
            createdAt: invoice.createdAt,
          };
        }
      }
      return offerProposalList;
    });
  }

  async getOfferProposalDetails(offerProposalId: number): Promise<OfferProposalDetailsT> {
    return prisma.$transaction(async (tx) => {
      const r = await tx.offerProposal.findUniqueOrThrow({
        where: {
          id: offerProposalId
        },
        include: {
          user: {
            select: {
              id: true,
              userType: true
            }
          }
        }
      });
      if (r.user.userType === UserTypeT.Creator){
        const creatorR = await tx.user.findUniqueOrThrow({
          where: {
            id: r.user.id
          },
          ...offerUserHelper.creatorQuery
        });
        const thumbPath = await getClerkUserMap([creatorR.sub])
          .then(map => map.get(creatorR.sub)?.imageUrl) ?? undefined;
        const locale = await getLocale();
        const sender = offerUserHelper.creatorMapToDTO(creatorR, locale, thumbPath);
        return {
          ...offerProposalHelper.mapToDTO(r),
          sender,
          offerId: r.offerId,
        };
      } else {
        const buyerR = await tx.user.findUniqueOrThrow({
          where: {
            id: r.user.id
          },
          ...offerUserHelper.buyerQuery
        });
        const thumbPath = await getClerkUserMap([buyerR.sub])
          .then(map => map.get(buyerR.sub)?.imageUrl) ?? undefined;
        const sender = offerUserHelper.buyerMapToDTO(buyerR, thumbPath);
        return {
          ...offerProposalHelper.mapToDTO(r),
          sender,
          offerId: r.offerId,
        };
      }
    });
  }

  // 인보이스 > 상세
  async getOfferDetails(offerProposalId: number): Promise<OfferDetailsT> {
    const r = await prisma.offerProposal.findUniqueOrThrow({
      where: {
        id: offerProposalId
      },
      include: {
        // 인보이스 발행 여부 확인
        invoice: {
          select: {
            id: true,
          }
        },
        offer: {
          select: {
            // 바이어
            user: offerUserHelper.buyerQuery,
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
                    user: offerUserHelper.creatorQuery
                  }
                }
              }
            }
          }
        }
      }
    });
    const isInvoiced = !!r.invoice;
    const { user: buyerUser, bidRound } = r.offer;
    const { webtoon } = bidRound;
    const { user: creatorUser } = webtoon;
    const clerkUserMap = await getClerkUserMap([buyerUser.sub, creatorUser.sub]);

    // 바이어 정보 기입
    const buyerClerkUser = clerkUserMap.get(buyerUser.sub);
    const buyerDto = offerUserHelper.buyerMapToDTO(
      buyerUser, buyerClerkUser?.imageUrl, {
        includeContactInfo: isInvoiced
      }
    );

    const locale = await getLocale();

    // 저작권자 정보 기입
    const creatorClerkUser = clerkUserMap.get(creatorUser.sub);
    const creatorDto = offerUserHelper.creatorMapToDTO(
      creatorUser, locale, creatorClerkUser?.imageUrl, {
        includeContactInfo: isInvoiced
      }
    );

    return {
      ...offerProposalHelper.mapToDTO(r),
      webtoon: {
        ...webtoonDetailsHelper.mapToDTO(webtoon, locale),
        activeBidRound: {
          isNew: bidRound.isNew,
          currentEpisodeNo: bidRound.currentEpisodeNo ?? undefined,
          totalEpisodeCount: bidRound.totalEpisodeCount ?? undefined,
        }
      },
      creator: creatorDto,
      buyer: buyerDto,
    };
  }
}

const offerProposalService = new OfferProposalService();
export default offerProposalService;