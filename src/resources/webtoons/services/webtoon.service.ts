import "server-only";
import {
  WebtoonFormT
} from "@/resources/webtoons/dtos/webtoon.dto";
import prisma from "@/utils/prisma";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { authorizeWebtoonAccess } from "@/resources/authorization";

class WebtoonService {
  async create(form: WebtoonFormT) {
    // 저작권자 확인
    const { userId } = await getTokenInfo({
      creator: true
    });
    const { genreIds, ...rest } = form;
    await prisma.$transaction(async (tx) => {
      const result = await tx.webtoon.create({
        data: {
          ...rest,
          user: {
            connect: {
              id: userId
            }
          }
        },
        select: {
          id: true
        }
      });
      await tx.xWebtoonGenre.createMany({
        data: genreIds.map(id => ({
          webtoonId: result.id,
          genreId: id
        }))
      });
    });
  };

  async update(webtoonId: number, form: WebtoonFormT) {
    const { genreIds, ...rest } = form;
    await prisma.$transaction(async (tx) => {
      // 접근 권한 확인
      await authorizeWebtoonAccess(tx, webtoonId);
      const { genreLinks } = await tx.webtoon.update({
        data: rest,
        where: { id: webtoonId },
        select: {
          genreLinks: true
        }
      });

      // 새로 선택된 장르 선택
      const genreIdsToAdd = genreIds.filter(id => !genreLinks.some(l => l.genreId === id));
      if (genreIdsToAdd.length > 0) {
        await tx.xWebtoonGenre.createMany({
          data: genreIdsToAdd.map(id => ({
            webtoonId,
            genreId: id
          }))
        });
      }

      // 더 이상 사용하지 않는 장르 삭제
      await tx.xWebtoonGenre.deleteMany({
        where: {
          webtoonId,
          genreId: {
            notIn: form.genreIds
          }
        }
      });
    });
  };
}

const webtoonService = new WebtoonService();
export default webtoonService;