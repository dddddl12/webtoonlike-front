import "server-only";
import { WebtoonLikeCountT, WebtoonLikeWithMineT } from "@/resources/webtoonLikes/webtoonLike.dto";
import { getTokenInfo } from "@/resources/tokens/token.service";
import prisma from "@/utils/prisma";

class WebtoonLikeService {

  async createLike(webtoonId: number): Promise<WebtoonLikeWithMineT> {
    const { userId } = await getTokenInfo({
      buyer: true,
    });
    const likeCount = await prisma.$transaction(async (tx) => {
      await tx.webtoonLike.upsert({
        where: {
          userId_webtoonId: { userId, webtoonId },
        },
        create: { userId, webtoonId },
        update: {}
      });
      const { _count } = await tx.webtoonLike.aggregate({
        where: { webtoonId },
        _count: true
      });
      return _count;
    });
    return {
      webtoonId,
      likeCount,
      myLike: true
    };
  }

  async deleteLike(webtoonId: number): Promise<WebtoonLikeWithMineT> {
    const { userId } = await getTokenInfo({
      buyer: true,
    });
    const likeCount = await prisma.$transaction(async (tx) => {
      await tx.webtoonLike.deleteMany({
        where: { userId, webtoonId }
      });
      const { _count } = await tx.webtoonLike.aggregate({
        where: { webtoonId },
        _count: true
      });
      return _count;
    });
    return {
      webtoonId,
      likeCount,
      myLike: false
    };
  }

  async getCountByUserId(userId?: number): Promise<WebtoonLikeCountT> {
    if (userId !== undefined) {
      // /creators/[userId] 페이지
      await getTokenInfo({
        buyer: true,
        admin: true
      });
    } else {
      // 저작권자 본인 계정 관리 페이지
      userId = await getTokenInfo({
        creator: true
      }).then(({ userId }) => userId);
    }

    const likeCount = await prisma.webtoonLike.count({
      where: {
        webtoon: {
          is: {
            userId
          }
        }
      }
    });
    return {
      likeCount
    };
  }
}
const webtoonLikeService = new WebtoonLikeService();
export default webtoonLikeService;