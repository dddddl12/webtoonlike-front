import "server-only";
import prisma from "@/utils/prisma";
import { getLocale } from "next-intl/server";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { AdminLevel } from "@/resources/tokens/token.types";
import webtoonHelper from "@/resources/webtoons/helpers/webtoon.helper";
import webtoonDetailsHelper from "@/resources/webtoons/helpers/webtoonDetails.helper";
import { WebtoonDetailsExtendedT, WebtoonDetailsT } from "@/resources/webtoons/dtos/webtoonDetails.dto";
import bidRoundHelper from "@/resources/bidRounds/helpers/bidRound.helper";

class WebtoonDetailsService {
  async getDetails(webtoonId: number): Promise<WebtoonDetailsT> {
    // 기본 조회
    const where = await webtoonHelper.whereWithReadAccess(webtoonId);
    const r = await prisma.webtoon.findUniqueOrThrow({
      ...webtoonDetailsHelper.query,
      where
    });
    const locale = await getLocale();
    return webtoonDetailsHelper.mapToDTO(r, locale);
  };

  async getDetailsExtended(webtoonId: number): Promise<WebtoonDetailsExtendedT> {
    // 상세 조회
    const where = await webtoonHelper.whereWithReadAccess(webtoonId);
    const { userId, metadata } = await getTokenInfo();
    const r = await prisma.webtoon.findUniqueOrThrow({
      where,
      include: {
        ...webtoonDetailsHelper.query.include,
        episodes: {
          select: {
            id: true,
          },
          orderBy: {
            episodeNo: "asc",
          },
          take: 1
        },
        bidRounds: {
          where: {
            isActive: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        },
        likes: {
          where: {
            userId
          },
          take: 1
        }
      }
    });
    const bidRoundRecord = r.bidRounds?.[0];
    const bidRound = bidRoundRecord
      ? bidRoundHelper.mapToDTO(bidRoundRecord)
      : undefined;
    const locale = await getLocale();
    const webtoonDetailsDto = webtoonDetailsHelper.mapToDTO(r, locale);
    return {
      ...webtoonDetailsDto,
      isEditable: metadata.type === UserTypeT.Creator
      && (r.userId === userId || metadata.adminLevel >= AdminLevel.Admin),
      hasRightToOffer: metadata.type === UserTypeT.Buyer,
      likeCount: r._count.likes,
      myLike: r.likes.length > 0,
      activeBidRound: bidRound,
      firstEpisodeId: r.episodes?.[0]?.id,
    };
  };
}

const webtoonDetailsService = new WebtoonDetailsService();
export default webtoonDetailsService;
