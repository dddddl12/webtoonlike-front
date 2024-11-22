import { AgeLimit, TargetAge, TargetGender, WebtoonFormT, WebtoonPreviewT } from "@/resources/webtoons/webtoon.types";
import { $Enums, Prisma } from "@prisma/client";
import prisma from "@/utils/prisma";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { MyWebtoonOnSaleT } from "@/resources/webtoons/webtoon.controller";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/bidRound.types";
import { AdminLevel } from "@/resources/tokens/token.types";
import { UserTypeT } from "@/resources/users/user.types";
import { UnexpectedServerError } from "@/handlers/errors";
import { authorizeWebtoonAccess } from "@/resources/authorization";
import bidRoundService from "@/resources/bidRounds/bidRound.service";

const previewSelect = {
  id: true,
  title: true,
  title_en: true,
  description: true,
  description_en: true,
  thumbPath: true,
};

export class WebtoonService {
  mapToPreviewDTO = (record: Prisma.WebtoonGetPayload<{
    select: typeof previewSelect;
  }>): WebtoonPreviewT => {
    return {
      id: record.id,
      title: record.title,
      title_en: record.title_en,
      description: record.description ?? undefined,
      description_en: record.description_en ?? undefined,
      thumbPath: record.thumbPath,
    };
  };

  async whereWithReadAccess (webtoonId: number) {
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
          some: bidRoundService.offerableBidRoundFilter()
        };
      }
    }
    return where;
  };

  async create(form: WebtoonFormT) {
    // 저작권자 확인
    const { userId } = await getTokenInfo({
      creator: true
    });
    const { genreIds, ...rest } = form;
    await prisma.$transaction(async (tx) => {
      const result = await tx.webtoon.create({
        data: {
          ...rest,
          user: {
            connect: {
              id: userId
            }
          }
        },
        select: {
          id: true
        }
      });
      await tx.xWebtoonGenre.createMany({
        data: genreIds.map(id => ({
          webtoonId: result.id,
          genreId: id
        }))
      });
    });
  };

  async update(webtoonId: number, form: WebtoonFormT) {
    const { genreIds, ...rest } = form;
    await prisma.$transaction(async (tx) => {
      // 접근 권한 확인
      await authorizeWebtoonAccess(tx, webtoonId);
      const { genreLinks } = await tx.webtoon.update({
        data: rest,
        where: { id: webtoonId },
        select: {
          genreLinks: true
        }
      });

      // 새로 선택된 장르 선택
      const genreIdsToAdd = genreIds.filter(id => !genreLinks.some(l => l.genreId === id));
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
  };

  async get(webtoonId: number) {
    // 조회
    const where = await this.whereWithReadAccess(webtoonId);
    const { userId, metadata } = await getTokenInfo();
    const record = await prisma.webtoon.findUniqueOrThrow({
      where,
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
      throw new UnexpectedServerError("Creator should exist.");
    }
    const bidRoundRecord = record.bidRounds?.[0];
    const bidRound = bidRoundRecord
      ? bidRoundService.mapToDTO(bidRoundRecord)
      : undefined;
    return {
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
      // TODO 이것이 표시가 되던가?
      targetGender: record.targetGender as TargetGender,
      thumbPath: record.thumbPath,
      isEditable: metadata.type === UserTypeT.Creator
      && (record.userId === userId || metadata.adminLevel >= AdminLevel.Admin),
      hasRightToOffer: metadata.type === UserTypeT.Buyer,
      authorOrCreatorName: record.authorName ?? creator?.name,
      authorOrCreatorName_en: record.authorName_en ?? creator?.name_en ?? undefined,
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
  };

  async list({ genreIds, userId, ageLimits, page }: {
    genreIds?: number[];
    userId?: number;
    ageLimits?: AgeLimit[];
    page: number;
  }) {
    // 바이어 전용
    await getTokenInfo({
      buyer: true,
      admin: true
    });
    const limit = 10;
    const where: Prisma.WebtoonWhereInput = {
      bidRounds: {
        some: bidRoundService.offerableBidRoundFilter()
      },
      userId
    };

    // Age limit 필터
    if (ageLimits && ageLimits.length > 0) {
      where.ageLimit = {
        in: ageLimits
      };
    }

    // Genre 필터
    if (genreIds && genreIds.length > 0) {
      where.genreLinks = {
        some: {
          genreId: {
            in: genreIds
          }
        }
      };
    }

    const [records, totalRecords] = await prisma.$transaction([
      prisma.webtoon.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        select: previewSelect
      }),
      prisma.webtoon.count({ where })
    ]);
    return {
      items: records.map(this.mapToPreviewDTO),
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  async listLikedWebtoons({ page }: {
    page: number;
  }) {
    // 바이어용
    const { userId } = await getTokenInfo({
      buyer: true,
    });
    const where: Prisma.WebtoonLikeWhereInput = {
      userId
    };

    // TODO 오퍼 가능 기간이 끝나면?

    const limit = 10;
    const [records, totalRecords] = await prisma.$transaction([
      prisma.webtoonLike.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        select: {
          webtoon: {
            select: previewSelect
          }
        }
      }),
      prisma.webtoonLike.count({ where })
    ]);
    return {
      items: records.map(record => {
        return this.mapToPreviewDTO(record.webtoon);
      }),
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  async listMyWebtoonsNotOnSale({ page }: {
    page: number;
  }){
    // 저작권자용
    const { userId } = await getTokenInfo({
      creator: true,
    });

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
          ...this.mapToPreviewDTO(record),
          createdAt: record.createdAt,
          bidRoundApprovalStatus,
          episodeCount: record._count.episodes ?? 0
        };
      }),
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  async listMyWebtoonsOnSale({ page }: {
    page: number;
  }){
    // 저작권자용
    const { userId } = await getTokenInfo({
      creator: true,
    });

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
    const items: MyWebtoonOnSaleT[] = [];
    for (const record of records) {
      const bidRoundRecord = record.bidRounds[0];
      const bidRoundStatus = bidRoundService.getStatusFromRecord(bidRoundRecord);
      if (!bidRoundRecord.approvalDecidedAt) {
        continue;
      }
      items.push({
        ...this.mapToPreviewDTO(record),
        bidRoundApprovedAt: bidRoundRecord.approvalDecidedAt,
        bidRoundStatus
      });
    }
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  };
}

const webtoonService = new WebtoonService();
export default webtoonService;