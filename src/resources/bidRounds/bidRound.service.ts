import "server-only";
import { $Enums, BidRound as BidRoundRecord, Prisma } from "@prisma/client";
import {
  BidRoundApprovalStatus,
  BidRoundFormT,
  BidRoundStatus,
  BidRoundT,
  ContractRange, StrictBidRoundAdminSettingsT
} from "@/resources/bidRounds/bidRound.types";
import { getBidRoundStatus } from "@/resources/bidRounds/bidRoundStatus";
import prisma from "@/utils/prisma";
import {
  AdminPageBidRoundFilterT, AdminPageBidRoundT, AdminPageBidRoundWithOffersT
} from "@/resources/bidRounds/bidRound.controller";
import { authorizeWebtoonAccess } from "@/resources/authorization";
import { getTokenInfo } from "@/resources/tokens/token.service";
import webtoonService from "@/resources/webtoons/webtoon.service";

class BidRoundService {
  offerableBidRoundFilter = (): Prisma.BidRoundWhereInput => {
    const now = new Date();
    return {
      isActive: true,
      approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED,
      bidStartsAt: {
        lte: now
      }
    };
  };

  getStatusFromRecord = (record: {
    bidStartsAt: Date | null;
    negoStartsAt: Date | null;
    processEndsAt: Date | null;
    approvalStatus: $Enums.BidRoundApprovalStatus;
  }): BidRoundStatus => {
    const { bidStartsAt, negoStartsAt, processEndsAt, approvalStatus } = record;
    return getBidRoundStatus({
      bidStartsAt: bidStartsAt ?? undefined,
      negoStartsAt: negoStartsAt ?? undefined,
      processEndsAt: processEndsAt ?? undefined,
      approvalStatus: approvalStatus as BidRoundApprovalStatus
    });
  };

  mapToDTO = (record: BidRoundRecord): BidRoundT => {
    const status = this.getStatusFromRecord(record);
    return {
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      webtoonId: record.webtoonId,
      contractRange: ContractRange.safeParse(record.contractRange).data ?? [],
      isOriginal: record.isOriginal,
      isNew: record.isNew,
      totalEpisodeCount: record.totalEpisodeCount ?? undefined,
      currentEpisodeNo: record.currentEpisodeNo ?? undefined,
      monthlyEpisodeCount: record.monthlyEpisodeCount ?? undefined,
      status,
    };
  };

  async create(webtoonId: number, form: BidRoundFormT) {
    await prisma.$transaction(async (tx) => {
      // 웹툰 접근 권한 확인
      await authorizeWebtoonAccess(tx, webtoonId);
      const existingRecord = await tx.bidRound.findFirst({
        where: {
          webtoonId,
          isActive: true,
        },
      });
      if (existingRecord) {
      // TODO 재등록 조건
        throw Error("already exists bid round for webtoonId: " + webtoonId);
      }
      await tx.bidRound.create({
        data: {
          isActive: true,
          ...form,
          webtoon: {
            connect: {
              id: webtoonId,
            }
          }
        }
      });
    });
  };

  async update(webtoonId: number, bidRoundId: number, form: BidRoundFormT) {
    await prisma.$transaction(async (tx) => {
      // 웹툰 접근 권한 확인
      await authorizeWebtoonAccess(tx, webtoonId);
      await tx.bidRound.update({
        data: form,
        where: {
          id: bidRoundId,
          webtoonId
        }
      });
    });
  };

  async getByWebtoonId (webtoonId: number) {
    const webtoonWhere = await webtoonService.whereWithReadAccess(webtoonId);
    const record = await prisma.bidRound.findFirstOrThrow({
      where: {
        isActive: true,
        webtoon: webtoonWhere
      }
    });
    return this.mapToDTO(record);
  };

  async adminListBidRoundsWithWebtoon({
    page, approvalStatus
  }: AdminPageBidRoundFilterT) {
    await getTokenInfo({
      admin: true,
    });
    const limit = 5;
    const where: Prisma.BidRoundWhereInput = {
      approvalStatus: approvalStatus as $Enums.BidRoundApprovalStatus,
      isActive: true,
    };
    const [records, totalRecords] = await prisma.$transaction([
      prisma.bidRound.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
        include: {
          webtoon: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbPath: true,
              user: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      }),
      prisma.bidRound.count({ where })
    ]);

    // getBidRoundStatus
    const items: AdminPageBidRoundT[] = [];
    for (const record of records) {
      const status = this.getStatusFromRecord(record);
      items.push({
        id: record.id,
        createdAt: record.createdAt,
        status,
        adminSettings: {
          bidStartsAt: record.bidStartsAt ?? undefined,
          negoStartsAt: record.negoStartsAt ?? undefined,
          processEndsAt: record.processEndsAt ?? undefined,
          adminNote: record.adminNote ?? undefined,
        },
        webtoon: {
          id: record.webtoon.id,
          title: record.webtoon.title,
          description: record.webtoon.description ?? undefined,
          thumbPath: record.webtoon.thumbPath,
        },
        creator: {
          user: {
            name: record.webtoon.user.name,
          }
        }
      });
    }
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  async adminListBidRoundsWithOffers({ page }: {
    page: number;
  }) {
    await getTokenInfo({
      admin: true,
    });
    const limit = 5;
    const now = new Date();
    const where: Prisma.BidRoundWhereInput = {
      approvalStatus: BidRoundApprovalStatus.Approved,
      isActive: true,
      bidRequests: {
        some: {}
      },
      negoStartsAt: {
        gt: now
      },
      bidStartsAt: {
        lte: now
      }
    };
    const [records, totalRecords] = await prisma.$transaction([
      prisma.bidRound.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
        select: {
          id: true,
          _count: {
            select: {
              bidRequests: true,
            }
          },
          negoStartsAt: true,
          webtoon: {
            select: {
              id: true,
              title: true,
              title_en: true,
              thumbPath: true,
              user: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      }),
      prisma.bidRound.count({ where })
    ]);
    const items: AdminPageBidRoundWithOffersT[] = records.map(r => ({
      id: r.id,
      negoStartsAt: r.negoStartsAt ?? undefined,
      webtoon: {
        id: r.webtoon.id,
        title: r.webtoon.title,
        title_en: r.webtoon.title_en,
        thumbPath: r.webtoon.thumbPath,
      },
      creator: {
        user: {
          name: r.webtoon.user.name,
        },
      },
      offerCount: r._count.bidRequests,
    }));
    return {
      items,
      totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async approve(bidRoundId: number) {
    await getTokenInfo({
      admin: true,
    });
    await prisma.bidRound.update({
      where: {
        id: bidRoundId
      },
      data: {
        approvalStatus: BidRoundApprovalStatus.Approved,
        approvalDecidedAt: new Date(),
      }
    });
  }

  // TODO 사유 포함
  async disapprove(bidRoundId: number) {
    await getTokenInfo({
      admin: true,
    });
    await prisma.bidRound.update({
      where: {
        id: bidRoundId
      },
      data: {
        approvalStatus: BidRoundApprovalStatus.Disapproved,
        approvalDecidedAt: new Date(),
      }
    });
  }

  async editBidRoundAdminSettings(bidRoundId: number, settings: StrictBidRoundAdminSettingsT) {
    await getTokenInfo({
      admin: true,
    });
    await prisma.bidRound.update({
      where: {
        id: bidRoundId
      },
      data: settings
    });
  }
}

const bidRoundService = new BidRoundService();
export default bidRoundService;