import { AdminLevel } from "@/resources/tokens/token.types";
import { ForbiddenError } from "@/handlers/errors";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { PrismaTransaction } from "@/resources/globalTypes";
import { UserTypeT } from "@/resources/users/dtos/user.dto";

// todo 인증 재확인
const authorizeOfferAccess = async (
  tx: PrismaTransaction,
  offerId: number,
) => {
  const { userId, metadata } = await getTokenInfo();
  if (metadata.adminLevel >= AdminLevel.Admin) {
    // 관리자면 무조건 통과
    return;
  }

  if (metadata.type === UserTypeT.Creator) {
    // 저작권자는 자기 자신의 웹툰 관련만 조회 가능
    const r = await tx.offer.findUniqueOrThrow({
      where: { id: offerId },
      select: {
        bidRound: {
          select: {
            webtoon: {
              select: {
                userId: true
              }
            }
          }
        }
      }
    });
    const webtoonUserId = r.bidRound.webtoon.userId;
    if (webtoonUserId !== userId) {
      throw new ForbiddenError();
    }
  } else {
    // 바이어는 공개된 작품만 조회 가능
    const { userId: offerUserId } = await tx.offer.findUniqueOrThrow({
      where: {
        id: offerId
      },
      select: {
        userId: true
      }
    });
    if (offerUserId !== userId) {
      throw new ForbiddenError();
    }
  }
};

export default authorizeOfferAccess;