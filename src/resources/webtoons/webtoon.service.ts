"use server";

import prisma from "@/utils/prisma";
import { BidRound as BidRoundRecord, Prisma, Webtoon as WebtoonRecord } from "@prisma/client";
import {
  AgeLimit,
  HomeArtistItem,
  HomeWebtoonItem,
  TargetAge, TargetGender, WebtoonExtendedT, WebtoonT,
} from "@/resources/webtoons/webtoon.types";
import { BidRoundStatus, BidRoundT, ContractRange } from "@/resources/bidRounds/bidRound.types";
import { UserTypeT } from "@/resources/users/user.types";
import { WrongUserTypeError } from "@/errors";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { AdminLevel } from "@/resources/tokens/token.types";

type BidRoundFilter = BidRoundStatus[] | "any" | "none"

const mapToWebtoonDTO = (record: WebtoonRecord): WebtoonT => ({
  id: record.id,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  title: record.title,
  title_en: record.title_en ?? undefined,
  description: record.description ?? undefined,
  description_en: record.description_en ?? undefined,
  externalUrl: record.externalUrl ?? undefined,
  englishUrl: record.externalUrl ?? undefined,
  adultOnly: record.adultOnly,
  targetAges: record.targetAges
    .map(a => a as TargetAge),
  ageLimit: record.ageLimit as AgeLimit,
  targetGender: record.ageLimit as TargetGender,
  thumbPath: record.thumbPath,
});

const mapToBidRoundDTO = (record: BidRoundRecord): BidRoundT => ({
  id: record.id,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  webtoonId: record.webtoonId,
  contractRange: ContractRange.safeParse(record.contractRange).data ?? [],
  isOriginal: record.isOriginal,
  isNew: record.isNew,
  episodeCount: record.episodeCount ?? undefined,
  currentEpisodeNo: record.currentEpisodeNo ?? undefined,
  monthlyEpisodeCount: record.monthlyEpisodeCount ?? undefined,
  status: record.status as BidRoundStatus,
  bidStartsAt: record.bidStartsAt ?? undefined,
  negoStartsAt: record.negoStartsAt ?? undefined,
  processEndsAt: record.processEndsAt ?? undefined,
  disapprovedAt: record.disapprovedAt ?? undefined,
});


export async function getWebtoon(id: number): Promise<WebtoonExtendedT> {
  // TODO 에러 핸들링
  const { userId, metadata } = await getTokenInfo();
  return prisma.webtoon.findUniqueOrThrow({
    where: { id },
    include: {
      user: {
        select: {
          creator: {
            select: {
              id: true,
              name: true,
              name_en: true,
            }
          }
        }
      },
      episodes: {
        select: {
          id: true,
        },
        orderBy: {
          episodeNo: "asc",
        },
        take: 1
      },
      bidRound: {
        include: {
          _count: {
            select: {
              bidRequests: true
            }
          }
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
      },
      genreLinks: {
        select: {
          genre: {
            select: {
              id: true,
              label: true,
              label_en: true
            }
          }
        },
        orderBy: {
          genre: {
            rank: "asc"
          }
        }
      }
    }
  }).then(record => {
    const { creator } = record.user;
    if (!creator) {
      // TODO http 에러로 대체
      throw new Error("Creator should exist.");
    }
    return {
      ...mapToWebtoonDTO(record),
      isEditable: metadata.adminLevel > AdminLevel.None || record.userId === userId,
      authorOrCreatorName: record.authorName ?? creator.name,
      authorOrCreatorName_en: record.authorName_en ?? creator.name_en ?? undefined,
      likeCount: record._count.likes,
      myLike: record.likes.length > 0,
      genres: record.genreLinks
        .map(l=> ({
          id: l.genre.id,
          label: l.genre.label,
          label_en: l.genre.label_en ?? undefined,
        })),
      bidRound: record.bidRound ? {
        ...mapToBidRoundDTO(record.bidRound),
        bidRequestCount: record.bidRound._count.bidRequests ?? 0
      } : undefined,
      firstEpisodeId: record.episodes?.[0].id,
    };
  });
}

export async function listWebtoons({
  statuses, genreId, ageLimit,
  page = 1,
  limit = 10
}: {
  statuses?: BidRoundFilter;
  genreId?: number;
  ageLimit?: AgeLimit;
  page?: number;
  limit?: number;
} = {}): Promise<ListResponse<WebtoonT>> {
  const where: Prisma.WebtoonWhereInput = {
    ageLimit: ageLimit,
    bidRound: getBidRoundFilter(statuses),
    genreLinks: genreId ? {
      some: { genreId }
    } : undefined,
  };

  const [records, totalRecords] = await prisma.$transaction([
    prisma.webtoon.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.webtoon.count({ where })
  ]);
  return {
    items: records.map(mapToWebtoonDTO),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

const getBidRoundFilter = (statuses?:BidRoundFilter): Prisma.WebtoonWhereInput["bidRound"] => {
  if (!statuses) {
    return;
  } else if (statuses === "any") {
    return {
      isNot: null
    };
  } else if (statuses === "none") {
    return {
      is: null
    };
  } else if (Array.isArray(statuses)) {
    return statuses.length > 0 ? {
      status: {
        in: statuses
      }
    } : undefined;
  }
  throw new Error("Unknown statuses");
};

export async function listMyWebtoonsNotOnSale({ page = 1 }: {
  page?: number
} = {}): Promise<ListResponse<WebtoonT>> {
  const { metadata, userId } = await getTokenInfo();
  if(metadata.type !== UserTypeT.Creator) {
    throw new WrongUserTypeError();
  }

  const where: Prisma.WebtoonWhereInput = {
    userId,
    bidRound: {
      is: null
    }
  };
  const limit = 5;

  const [records, totalRecords] = await prisma.$transaction([
    prisma.webtoon.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.webtoon.count({ where })
  ]);
  return {
    items: records.map(mapToWebtoonDTO),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function listMyWebtoonsOnSale({ page = 1 }: {
  page?: number
} = {}): Promise<ListResponse<WebtoonT & {
  roundAddedAt: Date
}>> {
  const { metadata, userId } = await getTokenInfo();
  if(metadata.type !== UserTypeT.Creator) {
    throw new WrongUserTypeError();
  }

  const where: Prisma.WebtoonWhereInput = {
    userId,
    bidRound: {
      isNot: null
    }
  };
  const limit = 5;

  const [records, totalRecords] = await prisma.$transaction([
    prisma.webtoon.findMany({
      where,
      include: {
        bidRound: {
          select: {
            createdAt: true
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.webtoon.count({ where })
  ]);
  return {
    items: records.map(record => {
      if (!record.bidRound) {
        throw new Error("Unknown situation");
      }
      return {
        ...mapToWebtoonDTO(record),
        roundAddedAt: record.bidRound.createdAt
      };
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function homeItems() {
  // Using Prisma's transaction to run all queries concurrently
  const where: Prisma.WebtoonWhereInput = {
    bidRound: {
      status: {
        in: [BidRoundStatus.Bidding, BidRoundStatus.Negotiating]
      },
    },
  };
  const select = {
    id: true,
    title: true,
    title_en: true,
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
  const [popularRecords, brandNewRecords, perGenreRecords, artists] = await prisma.$transaction(async (tx) => {
    return Promise.all([
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
        where,
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
              id: userRecord.creator.id,
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

  const [popular, brandNew, perGenre]: HomeWebtoonItem[][] = [popularRecords, brandNewRecords, perGenreRecords]
    .map(group => {
      return group.map(item => ({
        id: item.id,
        title: item.title,
        title_en: item.title_en ?? undefined,
        creatorName: item.user?.creator?.name,
        creatorName_en: item.user?.creator?.name_en ?? undefined,
        thumbPath: item.thumbPath,
      }));
    });

  return {
    popular,
    brandNew,
    perGenre,
    artists
  };
}
