import { AdminLevel } from "@/resources/tokens/token.types";
import { ForbiddenError } from "@/handlers/errors";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { PrismaTransaction } from "@/resources/globalTypes";

export const authorizeWebtoonAccess = async (tx: PrismaTransaction, webtoonId: number) => {
  const { userId, metadata } = await getTokenInfo({
    creator: true,
    admin: true,
  });
  if (metadata.adminLevel >= AdminLevel.Admin) {
    // 관리자면 무조건 통과
    return;
  }

  // 아이디 일치 여부 확인
  const { userId: WebtoonUserId } = await tx.webtoon.findUniqueOrThrow({
    where: { id: webtoonId },
    select: { userId: true }
  });
  if (WebtoonUserId !== userId) {
    throw new ForbiddenError();
  }
};
