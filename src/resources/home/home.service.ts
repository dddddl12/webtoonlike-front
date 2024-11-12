"use server";

import { $Enums } from "@prisma/client";
import prisma from "@/utils/prisma";
import { BannerWebtoonItem, HomeCreatorItem, HomeGenreItem, HomeWebtoonItem } from "@/resources/home/home.types";
import { AgeLimit } from "@/resources/webtoons/webtoon.types";
import { PrismaTransaction } from "@/resources/globalTypes";
import { offerableBidRoundFilter } from "@/resources/bidRounds/bidRound.filters";

export async function homeItems() {
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
}

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
        id: webtoon.id,
        title: webtoon.title,
        title_en: webtoon.title_en,
        authorOrCreatorName: webtoon.authorName ?? creator.name,
        authorOrCreatorName_en: webtoon.authorName_en ?? creator.name_en ?? undefined,
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
      ...offerableBidRoundFilter(),
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
  return mapToHomeWebtoonItems(records
    .map(record => record.webtoon));
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
  }).then(mapToHomeWebtoonItems);
};

// 장르별 웹툰(최초 로드 이후 클라이언트에서 호출하는 데도 사용)
export const getPerGenre = async (
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
          some: offerableBidRoundFilter()
        }
      }
    },
    select: {
      webtoon: {
        select: webtoonSelect
      }
    }
  });
  return mapToHomeWebtoonItems(records
    .map(record => record.webtoon));
};

// 전체 장르 목록 및 첫번째 장르에 해당하는 웹툰
const getGenreSets = async (tx: PrismaTransaction): Promise<{
  genres: HomeGenreItem[];
  firstGenreItems?: HomeWebtoonItem[];
}> => {
  // 장르 목록
  const genreRecords = await tx.genre.findMany({
    orderBy: {
      rank: "asc"
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

// 작가
const getCreators = async (tx: PrismaTransaction): Promise<HomeCreatorItem[]> => {
  const records = await tx.user.findMany({
    where: {
      userType: $Enums.UserType.CREATOR,
      creator: {
        isNot: null
      },
      webtoons: {
        some: {}
      }
    },
    select: {
      id: true,
      creator: {
        select: {
          id: true,
          name: true,
          name_en: true,
          thumbPath: true
        }
      },
      _count: {
        select: {
          webtoons: true
        }
      }
    },
    take: 5
  });
  return records
    .map(record => {
      if (!record.creator) {
        throw new Error("Unknown situation");
      }
      return {
        id: record.id,
        name: record.creator.name,
        name_en: record.creator.name_en ?? undefined,
        numOfWebtoons: record._count.webtoons,
        thumbPath: record.creator.thumbPath ?? undefined,
      };
    });
};

const webtoonSelect = {
  id: true,
  title: true,
  title_en: true,
  authorName: true,
  authorName_en: true,
  user: {
    select: {
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

const mapToHomeWebtoonItems = (records: {
  user: {
    creator: {
      id: number;
      name: string;
      name_en: string | null;
    } | null;
  };
  id: number;
  title: string;
  title_en: string;
  authorName: string | null;
  authorName_en: string | null;
  thumbPath: string;
}[]): HomeWebtoonItem[] => {
  return records.map((record) => {
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
    };
  });
};