import "server-only";
import { PrismaTransaction } from "@/resources/globalTypes";
import { HomeItemsT, HomeWebtoonItem } from "@/resources/home/home.dto";
import { AgeLimit } from "@/resources/webtoons/dtos/webtoon.dto";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { GenreFilterT } from "@/resources/home/home.controller";
import { displayName } from "@/resources/displayName";
import { getLocale } from "next-intl/server";
import bidRoundHelper from "@/resources/bidRounds/helpers/bidRound.helper";

class HomeService {
  async getHomeItems(): Promise<HomeItemsT> {
    const [banners, popular, brandNew, genreSets, creators] = await prisma.$transaction(async (tx) => {
      return Promise.all([
        getBanners(tx),
        getPopular(tx),
        getBrandNew(tx),
        getGenreSets(tx),
        getCreators(tx)
      ]);
    });

    return {
      banners,
      popular,
      brandNew,
      genreSets,
      creators
    };
  };

  // 장르별 웹툰(최초 로드 이후 클라이언트에서 호출하는 데도 사용)
  async getPerGenreItems({ genreId }: GenreFilterT) {
    return getPerGenre(genreId);
  }
}
const homeService = new HomeService();
export default homeService;


// 배너 작품
const getBanners = async (tx: PrismaTransaction): Promise<HomeItemsT["banners"]> => {
  const now = new Date();
  const records = await tx.webtoonBanner.findMany({
    where: {
      displayStart: {
        lte: now
      },
      displayEnd: {
        gt: now
      }
    },
    select: {
      bannerUrl: true,
      webtoon: {
        select: {
          ...webtoonSelect,
          ageLimit: true,
          bidRounds: {
            where: {
              isActive: true,
            },
            take: 1,
            select: {
              isNew: true,
              _count: {
                select: {
                  offers: true
                }
              }
            }
          }
        }
      }
    }
  });

  const locale = await getLocale();
  return records
    .filter(record => record.webtoon.bidRounds.length > 0)
    .map(record => {
      const { webtoon } = record;
      const { creator } = webtoon.user;
      if (!creator) {
        throw new Error("Unknown situation");
      }
      const bidRound = webtoon.bidRounds[0];
      return {
        ...mapToHomeWebtoonItems(webtoon, locale),
        thumbPath: record.bannerUrl,
        isNew: bidRound.isNew,
        offers: bidRound._count.offers,
        ageLimit: webtoon.ageLimit as AgeLimit,
      };
    });
};

// 인기 웹툰
const getPopular = async (tx: PrismaTransaction): Promise<HomeItemsT["popular"]> => {
  const records = await tx.bidRound.findMany({
    take: 5,
    distinct: ["webtoonId"],
    where: {
      ...bidRoundHelper.offerableBidRoundWhere(),
      webtoon: {
        user: {
          creator: {
            isNot: null
          }
        }
      }
    },
    select: {
      webtoon: {
        select: webtoonSelect,
      }
    },
    orderBy: {
      webtoon: {
        likes: {
          _count: "desc"
        }
      }
    }
  });
  const locale = await getLocale();
  return records
    .map(record => mapToHomeWebtoonItems(record.webtoon, locale));
};

// 최신
const getBrandNew = async (tx: PrismaTransaction): Promise<HomeItemsT["brandNew"]> => {
  const records = await tx.webtoon.findMany({
    where: {
      isFeaturedAsNew: true
    },
    select: webtoonSelect,
    orderBy: [
      { createdAt: "desc" },
    ],
    take: 5
  });
  const locale = await getLocale();
  return records
    .map(r => mapToHomeWebtoonItems(r, locale));
};

// 장르별 웹툰(최초 로드 이후 클라이언트에서 호출하는 데도 사용)
const getPerGenre = async (
  genreId: number,
  tx?: PrismaTransaction
): Promise<HomeWebtoonItem[]> => {
  const records = await (tx || prisma).xWebtoonGenre.findMany({
    take: 10,
    where: {
      genreId: genreId,
      webtoon: {
        user: {
          creator: {
            isNot: null
          }
        },
        bidRounds: {
          some: bidRoundHelper.offerableBidRoundWhere(),
        }
      }
    },
    select: {
      webtoon: {
        select: webtoonSelect
      }
    }
  });
  const locale = await getLocale();
  return records
    .map(record => mapToHomeWebtoonItems(record.webtoon, locale));
};

// 전체 장르 목록 및 첫번째 장르에 해당하는 웹툰
const getGenreSets = async (tx: PrismaTransaction): Promise<HomeItemsT["genreSets"]> => {
  // 장르 목록
  const genreRecords = await tx.genre.findMany({
    orderBy: {
      createdAt: "asc",
    }
  });
  const locale = await getLocale();
  const genres: HomeItemsT["genreSets"]["genres"] = genreRecords.map(record => ({
    id: record.id,
    localized: {
      label: displayName(locale, record.label, record.label_en)
    }
  }));
  if (genres.length === 0) {
    return { genres };
  }

  // 첫번째 장르
  const firstGenreItems = await getPerGenre(genres[0].id, tx);
  return { genres, firstGenreItems };
};

// 작가(Random selection 때문에 raw query 사용)
// TODO creator ~ user join 보호 확인
const getCreators = async(
  tx: PrismaTransaction
): Promise<HomeItemsT["creators"]> => {
  const records: {
    id: number;
    name: string;
    name_en: string | null;
    thumb_path: string | null;
    webtoon_count: number;
  }[] = await tx.$queryRaw(
    Prisma.sql`SELECT c.name,
                      c.name_en,
                      c.thumb_path,
                      u.id        AS id,
                      CAST(COUNT(DISTINCT w.id) AS INTEGER) AS "webtoon_count"
               FROM creators c
                        JOIN users u ON u.id = c.user_id
                        LEFT JOIN webtoons w ON w.user_id = u.id
                        LEFT JOIN bid_rounds br ON br.webtoon_id = w.id
                           AND br.is_active = TRUE
                           AND br.approval_status = 'approved'
                           AND br.bid_starts_at < NOW()
               WHERE c.is_exposed = TRUE
               GROUP BY c.id,
                        c.name,
                        c.name_en,
                        c.thumb_path,
                        u.id
               ORDER BY RANDOM()
               LIMIT 5`);
  const locale = await getLocale();
  return records.map(r => ({
    id: r.id,
    thumbPath: r.thumb_path ?? undefined,
    webtoonCount: r.webtoon_count,
    localized: {
      name: displayName(locale, r.name, r.name_en),
    }
  }));
};

const webtoonSelect = {
  id: true,
  title: true,
  title_en: true,
  authorName: true,
  authorName_en: true,
  user: {
    select: {
      id: true,
      creator: {
        select: {
          id: true,
          name: true,
          name_en: true,
        },
      }
    }
  },
  thumbPath: true,
};

const mapToHomeWebtoonItems = (
  r: Prisma.WebtoonGetPayload<{
    select: typeof webtoonSelect;
  }>,
  locale: string,
): HomeWebtoonItem => {
  const { creator } = r.user;
  if (!creator) {
    throw new Error("Unknown situation");
  }
  return {
    id: r.id,
    thumbPath: r.thumbPath,
    creator: {
      user: {
        id: r.user.id,
      }
    },
    localized: {
      title: displayName(locale, r.title, r.title_en),
      authorOrCreatorName: displayName(locale, r.authorName, r.authorName_en)
          ?? displayName(locale, creator.name, creator.name_en)
    }
  };
};