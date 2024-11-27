import "server-only";
import { PrismaTransaction } from "@/resources/globalTypes";
import { OfferProposal as OfferProposalRecord } from "@prisma/client";
import { BadRequestError, ForbiddenError } from "@/handlers/errors";
import { getTranslations } from "next-intl/server";
import { getTokenInfo } from "@/resources/tokens/token.service";
import {
  OfferProposalFormT,
  OfferProposalSchema,
  OfferProposalStatus,
  OfferProposalT
} from "@/resources/offers/dtos/offerProposal.dto";

class OfferProposalHelper {
  mapToDTO = (record: OfferProposalRecord): OfferProposalT => {
    return {
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      message: record.message ?? undefined,
      contractRange: OfferProposalSchema.shape.contractRange
        .safeParse(record.contractRange).data ?? [],
      status: record.status as OfferProposalStatus,
      decidedAt: record.decidedAt ?? undefined,
    };
  };

  async createOfferProposal(
    tx: PrismaTransaction,
    offerId: number,
    formData: OfferProposalFormT
  ) {
    const { userId } = await getTokenInfo();
    await tx.offerProposal.create({
      data: {
        ...formData,
        user: {
          connect: {
            id: userId
          }
        },
        offer: {
          connect: {
            id: offerId
          }
        },
        status: OfferProposalStatus.Pending
      }
    });
  }

  async checkForValidAction(
    tx: PrismaTransaction,
    refOfferProposalId: number
  ) {
    const { status, ...record } = await tx.offerProposal.findUniqueOrThrow({
      where: {
        id: refOfferProposalId
      },
      select: {
        status: true,
        user: {
          select: {
            // 마지막 제안자 확인
            userType: true
          }
        },
        offer: {
          select: {
            // 적격 바이어 확인
            userId: true,
            bidRound: {
              select: {
                webtoon: {
                  select: {
                    // 적격 저작권자 확인
                    userId: true
                  }
                }
              }
            },
          }
        }
      }
    });
    const { userId, metadata } = await getTokenInfo();
    const t = await getTranslations("errors.serverActions.changeOfferProposalStatus");
    if (status !== OfferProposalStatus.Pending) {
      // 최신 제안이 아닌 것을 보고 오인하는 경우
      throw new BadRequestError({
        title: t("title"),
        message: t("outdated")
      });
    }
    if (record.user.userType === metadata.type
        || ![record.offer.userId, record.offer.bidRound.webtoon.userId].includes(userId)
    ) {
      // 메시지를 주고받는 경우에는 마지막 메시지를 수신한 측에서만 수락/거절 가능
      throw new ForbiddenError({
        title: t("title"),
        message: t("abnormalAccess"),
        logError: true
      });
    }
  }
}

const offerProposalHelper = new OfferProposalHelper();
export default offerProposalHelper;
