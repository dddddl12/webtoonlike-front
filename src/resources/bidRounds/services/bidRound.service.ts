import "server-only";
import {
  BidRoundFormT
} from "@/resources/bidRounds/dtos/bidRound.dto";
import prisma from "@/utils/prisma";
import { authorizeWebtoonAccess } from "@/resources/authorization";
import webtoonHelper from "@/resources/webtoons/helpers/webtoon.helper";
import bidRoundHelper from "@/resources/bidRounds/helpers/bidRound.helper";

class BidRoundService {
  async create(webtoonId: number, form: BidRoundFormT) {
    await prisma.$transaction(async (tx) => {
      // 웹툰 접근 권한 확인
      await authorizeWebtoonAccess(tx, webtoonId);
      const existingRecord = await tx.bidRound.findFirst({
        where: {
          webtoonId,
          isActive: true,
        },
      });
      if (existingRecord) {
      // TODO 재등록 조건
        throw Error("already exists bid round for webtoonId: " + webtoonId);
      }
      await tx.bidRound.create({
        data: {
          isActive: true,
          ...form,
          webtoon: {
            connect: {
              id: webtoonId,
            }
          }
        }
      });
    });
  };

  async update(webtoonId: number, bidRoundId: number, form: BidRoundFormT) {
    await prisma.$transaction(async (tx) => {
      // 웹툰 접근 권한 확인
      await authorizeWebtoonAccess(tx, webtoonId);
      await tx.bidRound.update({
        data: form,
        where: {
          id: bidRoundId,
          webtoonId
        }
      });
    });
  };

  async getByWebtoonId (webtoonId: number) {
    const webtoonWhere = await webtoonHelper.whereWithReadAccess(webtoonId);
    const record = await prisma.bidRound.findFirstOrThrow({
      where: {
        isActive: true,
        webtoon: webtoonWhere
      }
    });
    return bidRoundHelper.mapToDTO(record);
  };
}

const bidRoundService = new BidRoundService();
export default bidRoundService;