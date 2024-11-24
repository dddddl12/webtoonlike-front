import "server-only";
import {
  WebtoonEpisodeDetailsT,
  WebtoonEpisodeEnglishUrlFormT,
  WebtoonEpisodeFormT,
} from "@/resources/webtoonEpisodes/webtoonEpisode.dto";
import prisma from "@/utils/prisma";
import { authorizeWebtoonAccess } from "@/resources/authorization";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { AdminLevel } from "@/resources/tokens/token.types";
import webtoonHelper from "@/resources/webtoons/helpers/webtoon.helper";
import webtoonEpisodeHelper from "@/resources/webtoonEpisodes/webtoonEpisode.heloper";
import { getLocale } from "next-intl/server";
import { displayName } from "@/resources/displayName";

class WebtoonEpisodeService {
  async get(webtoonId: number, episodeId: number): Promise<WebtoonEpisodeDetailsT> {
    const webtoonWhere = await webtoonHelper.whereWithReadAccess(webtoonId);
    const { userId, metadata } = await getTokenInfo();

    const record = await prisma.webtoonEpisode.findUniqueOrThrow({
      where: {
        id: episodeId,
        webtoon: webtoonWhere
      },
      include: {
        webtoon: {
          select: {
            id: true,
            userId: true,
            title: true,
            title_en: true,
            // 현재는 에피소드의 등록 건수 자체가 많지 않으므로 이렇게 처리
            episodes: {
              select: {
                id: true,
                episodeNo: true,
              },
              orderBy: {
                episodeNo: "asc"
              }
            }
          }
        }
      }
    });

    const isEditable = metadata.type === UserTypeT.Creator
      && (record.webtoon.userId === userId || metadata.adminLevel >= AdminLevel.Admin);
    const episodeIds = record.webtoon.episodes
      .map(e => e.id);
    const navigation = {
      nextId: episodeIds[episodeIds.indexOf(episodeId) + 1],
      previousId: episodeIds[episodeIds.indexOf(episodeId) - 1],
    };

    const locale = await getLocale();
    return {
      ...webtoonEpisodeHelper.mapToDTO(record),
      isEditable,
      webtoon: {
        id: record.webtoon.id,
        localized: {
          title: displayName(locale, record.webtoon.title, record.webtoon.title_en)
        }
      },
      navigation
    };
  }

  async create(webtoonId: number, form: WebtoonEpisodeFormT) {
    const episodeRecord = await prisma.$transaction(async (tx) => {
      await authorizeWebtoonAccess(tx, webtoonId);
      return tx.webtoonEpisode.create({
        data: {
          ...form,
          webtoon: {
            connect: {
              id: webtoonId
            }
          }
        }
      });
    });
    return webtoonEpisodeHelper.mapToDTO(episodeRecord);
  }

  async update(
    webtoonId: number,
    episodeId: number,
    form: WebtoonEpisodeFormT | WebtoonEpisodeEnglishUrlFormT
  ) {
    if ((form as WebtoonEpisodeEnglishUrlFormT).englishUrl) {
      // englishUrl은 어드민만 수정 가능
      await getTokenInfo({
        admin: true,
      });
    }
    const episodeRecord = await prisma.$transaction(async (tx) => {
      await authorizeWebtoonAccess(tx, webtoonId);
      return tx.webtoonEpisode.update({
        data: form,
        where: {
          id: episodeId,
          webtoonId
        },
        include: {
          webtoon: {
            select: {
              userId: true
            }
          }
        }
      });
    });
    return webtoonEpisodeHelper.mapToDTO(episodeRecord);
  }
}

const webtoonEpisodeService = new WebtoonEpisodeService();
export default webtoonEpisodeService;