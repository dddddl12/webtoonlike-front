"use server";

import { Prisma, $Enums, Webtoon as WebtoonRecord } from "@prisma/client";
import {
  AgeLimit,
  HomeArtistItem,
  HomeWebtoonItem,
  TargetAge, TargetGender, WebtoonExtendedT, WebtoonFormSchema, WebtoonFormT, WebtoonPreviewT, WebtoonT,
} from "@/resources/webtoons/webtoon.types";
import { BidRoundApprovalStatus, BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { UserTypeT } from "@/resources/users/user.types";
import { WrongUserTypeError } from "@/errors";
import { ListResponse } from "@/resources/globalTypes";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { AdminLevel } from "@/resources/tokens/token.types";
import { getBidRoundStatus, mapToBidRoundDTO } from "@/resources/bidRounds/bidRound.service";
import prisma from "@/utils/prisma";

const convertToRecordInput = async (form: WebtoonFormT): Promise<
  Prisma.XOR<Prisma.WebtoonCreateInput, Prisma.WebtoonUncheckedCreateInput>
> => {
  const { userId } = await getTokenInfo();
  form = WebtoonFormSchema.parse(form);
  return {
    title: form.title,
    title_en: form.title_en,
    authorName: form.authorName,
    authorName_en: form.authorName_en,
    description: form.description,
    description_en: form.description_en,
    externalUrl: form.externalUrl,
    targetAges: form.targetAges,
    ageLimit: form.ageLimit,
    thumbPath: form.thumbPath,
    targetGender: form.targetGender,
    userId //TODO immutable
  };
};

// TODO 권한, 사용자 타입, 관리자 체크
export async function createWebtoon(form: WebtoonFormT) {
  await prisma.$transaction(async (tx) => {
    const data = await convertToRecordInput(form);
    const result = await tx.webtoon.create({
      data,
      select: {
        id: true
      }
    });
    await tx.xWebtoonGenre.createMany({
      data: form.genreIds.map(id => ({
        webtoonId: result.id,
        genreId: id
      }))
    });
  });
}

export async function updateWebtoon(webtoonId: number, form: WebtoonFormT) {
  await prisma.$transaction(async (tx) => {
    const data = await convertToRecordInput(form);
    const { genreLinks } = await tx.webtoon.update({
      data,
      where: { id: webtoonId },
      select: {
        genreLinks: true
      }
    });

    // 새로 선택된 장르 선택
    const genreIdsToAdd = form.genreIds.filter(id => !genreLinks.some(l => l.genreId === id));
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
}

const offerableBidRoundFilter = (): Prisma.BidRoundListRelationFilter => {
  const now = new Date();
  return {
    some: {
      isActive: true,
      approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED,
      bidStartsAt: {
        lte: now
      },
      // processEndsAt: {
      //   gt: now
      // }
    }
  };
};

const mapToWebtoonPreviewDTO = (record: {
  id: number;
  title: string;
  title_en: string;
  description: string | null;
  description_en: string | null;
  thumbPath: string;
}): WebtoonPreviewT => ({
  id: record.id,
  title: record.title,
  title_en: record.title_en,
  description: record.description ?? undefined,
  description_en: record.description_en ?? undefined,
  thumbPath: record.thumbPath,
});

const mapToWebtoonDTO = (record: WebtoonRecord): WebtoonT => ({
  id: record.id,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  title: record.title,
  title_en: record.title_en,
  description: record.description ?? undefined,
  description_en: record.description_en ?? undefined,
  externalUrl: record.externalUrl ?? undefined,
  targetAges: record.targetAges
    .map(a => a as TargetAge),
  ageLimit: record.ageLimit as AgeLimit,
  targetGender: record.ageLimit as TargetGender,
  thumbPath: record.thumbPath,
});

export async function getWebtoon(id: number): Promise<WebtoonExtendedT> {
  // TODO 에러 핸들링
  const { userId, metadata } = await getTokenInfo();
  const record = await prisma.webtoon.findUniqueOrThrow({
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
      bidRounds: {
        where: {
          isActive: true
        },
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
  });
  const { creator } = record.user;
  if (!creator) {
    // TODO http 에러로 대체
    throw new Error("Creator should exist.");
  }
  const bidRoundRecord = record.bidRounds?.[0];
  const bidRound = bidRoundRecord
    ? await mapToBidRoundDTO(bidRoundRecord)
      .then(r => ({
        ...r,
        bidRequestCount: bidRoundRecord._count.bidRequests ?? 0
      }))
    : undefined;
  return {
    ...mapToWebtoonDTO(record),
    isEditable: metadata.adminLevel >= AdminLevel.Admin || record.userId === userId,
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
    activeBidRound: bidRound,
    firstEpisodeId: record.episodes?.[0]?.id,
  };
}

export async function listWebtoons({
  genreId, ageLimit, userId,
  page = 1
}: {
  genreId?: number;
  ageLimit?: AgeLimit;
  page?: number;
  userId?: number;
} = {}): Promise<ListResponse<WebtoonPreviewT>> {
  const limit = 10;
  const where: Prisma.WebtoonWhereInput = {
    ageLimit: ageLimit,
    bidRounds: offerableBidRoundFilter(),
    genreLinks: genreId ? {
      some: { genreId }
    } : undefined,
    userId
  };

  const [records, totalRecords] = await prisma.$transaction([
    prisma.webtoon.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        title: true,
        title_en: true,
        description: true,
        description_en: true,
        thumbPath: true,
      }
    }),
    prisma.webtoon.count({ where })
  ]);
  return {
    items: records.map(mapToWebtoonPreviewDTO),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function listLikedWebtoons({
  page = 1
}: {
  page?: number;
} = {}): Promise<ListResponse<WebtoonPreviewT>> {
  const limit = 10;
  const { userId } = await getTokenInfo();
  const where: Prisma.WebtoonLikeWhereInput = {
    userId
  };

  // TODO 오퍼 가능 기간이 끝나면?

  const [records, totalRecords] = await prisma.$transaction([
    prisma.webtoonLike.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      select: {
        webtoon: {
          select: {
            id: true,
            title: true,
            title_en: true,
            description: true,
            description_en: true,
            thumbPath: true,
          }
        }
      }
    }),
    prisma.webtoonLike.count({ where })
  ]);
  return {
    items: records.map(record => {
      return mapToWebtoonPreviewDTO(record.webtoon);
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function listMyWebtoonsNotOnSale({ page = 1 }: {
  page?: number;
} = {}): Promise<ListResponse<WebtoonPreviewT & {
  createdAt: Date;
  bidRoundApprovalStatus?: BidRoundApprovalStatus;
  episodeCount: number;
}>> {
  const { metadata, userId } = await getTokenInfo();
  if (metadata.type !== UserTypeT.Creator) {
    throw new WrongUserTypeError();
  }

  const where: Prisma.WebtoonWhereInput = {
    userId,
    bidRounds: {
      none: {
        isActive: true,
        approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED
      }
    }
  };
  const limit = 5;

  const [records, totalRecords] = await prisma.$transaction([
    prisma.webtoon.findMany({
      where,
      include: {
        bidRounds: {
          select: {
            approvalStatus: true
          },
          where: {
            isActive: true,
          }
        },
        _count: {
          select: {
            episodes: true
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
      const activeBidRound = record.bidRounds?.[0];
      const bidRoundApprovalStatus = activeBidRound
        ? activeBidRound.approvalStatus as BidRoundApprovalStatus
        : undefined;
      return {
        ...mapToWebtoonPreviewDTO(record),
        createdAt: record.createdAt,
        bidRoundApprovalStatus,
        episodeCount: record._count.episodes ?? 0
      };
    }),
    totalPages: Math.ceil(totalRecords / limit),
  };
}

type MyWebtoonsOnSale = WebtoonPreviewT & {
  bidRoundApprovedAt?: Date;
  bidRoundStatus: BidRoundStatus;
};
export async function listMyWebtoonsOnSale({ page = 1 }: {
  page?: number;
} = {}): Promise<ListResponse<MyWebtoonsOnSale>> {
  const { metadata, userId } = await getTokenInfo();
  if (metadata.type !== UserTypeT.Creator) {
    throw new WrongUserTypeError();
  }

  const where: Prisma.WebtoonWhereInput = {
    userId,
    bidRounds: {
      some: {
        isActive: true,
        approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED
      }
    }
  };
  const limit = 5;

  const [records, totalRecords] = await prisma.$transaction([
    prisma.webtoon.findMany({
      where,
      include: {
        bidRounds: {
          select: {
            approvalDecidedAt: true,
            bidStartsAt: true,
            negoStartsAt: true,
            processEndsAt: true,
            approvalStatus: true,
          },
          where: {
            isActive: true,
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.webtoon.count({ where })
  ]);
  const items: MyWebtoonsOnSale[] = [];
  for (const record of records) {
    // TODO 등록일은 승인일 기준?
    const bidRoundRecord = record.bidRounds[0];
    const bidRoundStatus = await getBidRoundStatus(bidRoundRecord);
    items.push({
      ...mapToWebtoonPreviewDTO(record),
      bidRoundApprovedAt: bidRoundRecord.approvalDecidedAt ?? undefined,
      bidRoundStatus
    });
  }
  return {
    items,
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function homeItems() {
  const where: Prisma.WebtoonWhereInput = {
    bidRounds: offerableBidRoundFilter(),
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
    popular,
    brandNew,
    perGenre,
    artists
  };
}
