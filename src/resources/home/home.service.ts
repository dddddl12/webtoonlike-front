import { $Enums, Prisma } from "@prisma/client";
import prisma from "@/utils/prisma";
import { BannerWebtoonItem, HomeArtistItem, HomeWebtoonItem } from "@/resources/home/home.types";
import { AgeLimit } from "@/resources/webtoons/webtoon.types";

export async function homeItems() {
  const now = new Date();
  const where: Prisma.WebtoonWhereInput = {
    // TODO bid 중심으로 해야 할 수도 있음
    bidRounds: {
      some: {
        isActive: true,
        approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED,
        bidStartsAt: {
          lte: now
        }
      }
    },
    user: {
      creator: {
        isNot: null
      }
    }
  };
  const select = {
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

  // TODO async tx로 수정
  const [bannerRecords, popularRecords, brandNewRecords, perGenreRecords, artists] = await prisma.$transaction(async (tx) => {
    return Promise.all([
      // 배너 작품
      tx.webtoonBanner.findMany({
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
              ...select,
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
      }),
      // 인기 웹툰
      tx.webtoon.findMany({
        where,
        select: {
          ...select,
          _count: {
            select: {
              likes: true
            }
          }
        },
        orderBy: [
          {
            likes: {
              _count: "desc"
            }
          },
          { createdAt: "desc" },
        ],
        take: 4
      }),

      // 최신
      tx.webtoon.findMany({
        where: {
          isFeaturedAsNew: true
        },
        select,
        orderBy: [
          { createdAt: "desc" },
        ],
        take: 5
      }),

      // 장르
      tx.webtoon.findMany({
        where,
        select,
        take: 10
      }),

      // 작가
      tx.webtoon.groupBy({
        by: "userId",
        _count: {
          userId: true,
        },
        where: {
          user: {
            creator: {
              isNot: null
            },
          },
        },
        orderBy: {
          _count: {
            userId: "desc",
          },
        },
        take: 5
      }).then(async (records) => {
        const userRecords = await tx.user.findMany({
          select: {
            id: true,
            creator: {
              select: {
                id: true,
                name: true,
                name_en: true,
                thumbPath: true
              }
            }
          },
          where: {
            id: {
              in: records
                .map((r) => r.userId)
                .filter(r => r !== null)
            }
          }
        });
        const artists: HomeArtistItem[] = userRecords
          .map(userRecord => {
            if (!userRecord.creator) return;
            return {
              id: userRecord.id,
              name: userRecord.creator.name,
              name_en: userRecord.creator.name_en ?? undefined,
              numOfWebtoons: records.find(r => r.userId === userRecord.id)?._count.userId || 0,
              thumbPath: userRecord.creator.thumbPath ?? undefined,
            };
          })
          .filter(artist => !!artist);
        return artists;
      })
    ]);
  });

  const banners: BannerWebtoonItem[] = bannerRecords
    .filter(record => record.webtoon.bidRounds.length > 0)
    // todo SQL에서 걸러낼 것
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
        thumbPath: webtoon.thumbPath,
        isNew: bidRound.isNew,
        offers: bidRound._count.bidRequests,
        ageLimit: webtoon.ageLimit as AgeLimit,
      };
    });

  const [popular, brandNew, perGenre]: HomeWebtoonItem[][] = [popularRecords, brandNewRecords, perGenreRecords]
    .map(group => {
      return group.map(item => {
        const { creator } = item.user;
        if (!creator) {
          throw new Error("Unknown situation");
        }
        return {
          id: item.id,
          title: item.title,
          title_en: item.title_en,
          authorOrCreatorName: item.authorName ?? creator.name,
          authorOrCreatorName_en: item.authorName_en ?? creator.name_en ?? undefined,
          thumbPath: item.thumbPath,
        };
      });
    });

  return {
    banners,
    popular,
    brandNew,
    perGenre,
    artists
  };
}
