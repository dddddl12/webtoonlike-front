import "server-only";
import { WebtoonLikeWithMineT } from "@/resources/webtoonLikes/webtoonLike.types";
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

}
const webtoonLikeService = new WebtoonLikeService();
export default webtoonLikeService;