import "server-only";
import { PrismaTransaction } from "@/resources/globalTypes";
import { BannerWebtoonItem, HomeCreatorItem, HomeGenreItem, HomeWebtoonItem } from "@/resources/home/home.types";
import { AgeLimit } from "@/resources/webtoons/webtoon.types";
import bidRoundService from "@/resources/bidRounds/bidRound.service";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { GenreFilterT } from "@/resources/home/home.controller";

class HomeService {
  async getHomeItems() {
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
const getBanners = async (tx: PrismaTransaction): Promise<BannerWebtoonItem[]> => {
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
                  bidRequests: true
                }
              }
            }
          }
        }
      }
    }
  });

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
        ...mapToHomeWebtoonItems(webtoon),
        thumbPath: record.bannerUrl,
        isNew: bidRound.isNew,
        offers: bidRound._count.bidRequests,
        ageLimit: webtoon.ageLimit as AgeLimit,
      };
    });
};

// 인기 웹툰
const getPopular = async (tx: PrismaTransaction): Promise<HomeWebtoonItem[]> => {
  const records = await tx.bidRound.findMany({
    take: 5,
    distinct: ["webtoonId"],
    where: {
      ...bidRoundService.offerableBidRoundFilter(),
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
  return records
    .map(record => mapToHomeWebtoonItems(record.webtoon));
};

// 최신
const getBrandNew = async (tx: PrismaTransaction): Promise<HomeWebtoonItem[]> => {
  return tx.webtoon.findMany({
    where: {
      isFeaturedAsNew: true
    },
    select: webtoonSelect,
    orderBy: [
      { createdAt: "desc" },
    ],
    take: 5
  }).then(records => records
    .map(mapToHomeWebtoonItems));
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
          some: bidRoundService.offerableBidRoundFilter(),
        }
      }
    },
    select: {
      webtoon: {
        select: webtoonSelect
      }
    }
  });
  return records
    .map(record => mapToHomeWebtoonItems(record.webtoon));
};

// 전체 장르 목록 및 첫번째 장르에 해당하는 웹툰
const getGenreSets = async (tx: PrismaTransaction): Promise<{
  genres: HomeGenreItem[];
  firstGenreItems?: HomeWebtoonItem[];
}> => {
  // 장르 목록
  const genreRecords = await tx.genre.findMany({
    orderBy: {
      createdAt: "asc",
    }
  });
  const genres: HomeGenreItem[] = genreRecords.map(record => ({
    id: record.id,
    label: record.label,
    label_en: record.label_en ?? undefined,
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
const getCreators = async (tx: PrismaTransaction): Promise<HomeCreatorItem[]> => {
  return tx.$queryRaw(
    Prisma.sql`SELECT c.name,
                      COALESCE(c.name_en, '') AS name_en,
                      COALESCE(c.thumb_path, '') AS "thumbPath",
                      u.id        AS id,
                      CAST(COUNT(DISTINCT w.id) AS INTEGER) AS "numOfWebtoons"
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
  record: Prisma.WebtoonGetPayload<{
    select: typeof webtoonSelect;
  }>
): HomeWebtoonItem => {
  const { creator } = record.user;
  if (!creator) {
    throw new Error("Unknown situation");
  }
  return {
    id: record.id,
    title: record.title,
    title_en: record.title_en,
    authorOrCreatorName: record.authorName ?? creator.name,
    authorOrCreatorName_en: record.authorName_en ?? creator.name_en ?? undefined,
    thumbPath: record.thumbPath,
    creator: {
      user: {
        id: record.user.id,
      }
    }
  };
};