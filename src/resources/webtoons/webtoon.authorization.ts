import "server-only";
import { AdminLevel } from "@/resources/tokens/token.types";
import { ForbiddenError } from "@/handlers/errors";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { PrismaTransaction } from "@/resources/globalTypes";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import bidRoundHelper from "@/resources/bidRounds/helpers/bidRound.helper";

const authorizeWebtoonAccess = async (
  tx: PrismaTransaction,
  webtoonId: number,
  requireWriteAccess = false
) => {
  const { userId, metadata } = await getTokenInfo({
    admin: true,
    creator: true,
    buyer: !requireWriteAccess, // 바이어는 read만 가능
  });
  if (metadata.adminLevel >= AdminLevel.Admin) {
    // 관리자면 무조건 통과
    return;
  }

  if (metadata.type === UserTypeT.Creator) {
    // 저작권자는 자기 자신의 웹툰만 조회 가능
    const { userId: webtoonUserId } = await tx.webtoon.findUniqueOrThrow({
      where: { id: webtoonId },
      select: { userId: true }
    });
    if (webtoonUserId !== userId) {
      throw new ForbiddenError();
    }
  } else {
    // 바이어는 공개된 작품만 조회 가능
    await tx.webtoon.findUniqueOrThrow({
      where: {
        id: webtoonId,
        bidRounds: {
          some: bidRoundHelper.offerableBidRoundWhere()
        }
      },
      select: {
        id: true
      }
    });
  }
};

export default authorizeWebtoonAccess;