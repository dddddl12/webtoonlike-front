import "server-only";
import { Prisma, Webtoon as WebtoonRecord } from "@prisma/client";
import {
  AgeLimit,
  TargetAge,
  TargetGender,
  WebtoonT
} from "@/resources/webtoons/dtos/webtoon.dto";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { AdminLevel } from "@/resources/tokens/token.types";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import webtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";
import bidRoundHelper from "@/resources/bidRounds/helpers/bidRound.helper";

// TODO semi-graphql
class WebtoonHelper {
  mapToDTO = (r: WebtoonRecord, locale: string): WebtoonT => {
    return {
      ...webtoonPreviewHelper.mapToDTO(r, locale),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      title: r.title,
      title_en: r.title_en,
      description: r.description ?? undefined,
      description_en: r.description_en ?? undefined,
      externalUrl: r.externalUrl ?? undefined,
      targetAges: r.targetAges
        .map(a => a as TargetAge),
      ageLimit: r.ageLimit as AgeLimit,
      // TODO 이것이 표시가 되던가?
      targetGender: r.targetGender as TargetGender,
      thumbPath: r.thumbPath,
    };
  };

  whereWithReadAccess = async(webtoonId: number) => {
    const { userId, metadata } = await getTokenInfo();
    const where: Prisma.WebtoonWhereUniqueInput = {
      id: webtoonId
    };
    // 권한에 따른 조건 제한
    if (metadata.adminLevel < AdminLevel.Admin) {
      if (metadata.type === UserTypeT.Creator) {
      // 저작권자는 자기 자신의 웹툰만 조회 가능
        where.userId = userId;
      } else {
      // 바이어는 공개된 작품만 조회 가능
        where.bidRounds = {
          some: bidRoundHelper.offerableBidRoundWhere()
        };
      }
    }
    return where;
  };
}

const webtoonHelper = new WebtoonHelper();
export default webtoonHelper;
