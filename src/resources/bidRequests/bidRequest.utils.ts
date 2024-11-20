import "server-only";
import { $Enums, BidRequest as BidRequestRecord, Prisma } from "@prisma/client";
import { AdminLevel } from "@/resources/tokens/token.types";
import { UserTypeT } from "@/resources/users/user.types";
import { UnexpectedServerError } from "@/handlers/errors";
import { assertAdmin, getTokenInfo } from "@/resources/tokens/token.service";
import { ListResponse } from "@/resources/globalTypes";
import prisma from "@/utils/prisma";
import { SimpleBidRequestT } from "@/resources/bidRequests/bidRequest.service";
import { BidRequestSchema, BidRequestStatus, BidRequestT } from "@/resources/bidRequests/bidRequest.types";

export const mapToBidRequestDTO = (record: BidRequestRecord): BidRequestT => {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    bidRoundId: record.bidRoundId,
    message: record.message ?? undefined,
    contractRange: BidRequestSchema.shape.contractRange
      .safeParse(record.contractRange).data ?? [],
    userId: record.userId ?? undefined,
    status: record.status as BidRequestStatus
  };
};

export const getBidRequestWhereUniqueInputWithPermissionCheck = async (bidRequestId: number): Promise<Prisma.BidRequestWhereUniqueInput> => {
  const { userId, metadata } = await getTokenInfo();
  const where: Prisma.BidRequestWhereUniqueInput = {
    id: bidRequestId,
  };
  if (metadata.adminLevel < AdminLevel.Admin) {
    if (metadata.type === UserTypeT.Creator) {
      where.bidRound = {
        webtoon: {
          userId
        }
      };
    } else if (metadata.type === UserTypeT.Buyer) {
      where.userId = userId;
    } else {
      throw new UnexpectedServerError();
    }
  }
  return where;
};

export const simpleBidRequestIncludeForQuery = {
  bidRound: {
    select: {
      webtoon: {
        select: {
          id: true,
          title: true,
          title_en: true,
          thumbPath: true,
          user: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    }
  },
  user: {
    select: {
      id: true,
      name: true,
    }
  }
};

type SimpleBidRequestQueryResult = Prisma.BidRequestGetPayload<{
  include: typeof simpleBidRequestIncludeForQuery;
}>;
export const mapToSimpleBidRequestDTO = (r: SimpleBidRequestQueryResult): SimpleBidRequestT => {
  const { webtoon } = r.bidRound;
  const creatingUser = webtoon.user;
  const buyingUser = r.user;
  return {
    ...mapToBidRequestDTO(r),
    webtoon: {
      id: webtoon.id,
      title: webtoon.title,
      title_en: webtoon.title_en ?? undefined,
      thumbPath: webtoon.thumbPath,
    },
    creator: {
      user: {
        id: creatingUser.id,
        name: creatingUser.name
      }
    },
    buyer: {
      user: {
        id: buyingUser.id,
        name: buyingUser.name
      }
    }
  };
};

export async function listBidRequests(
  {
    page,
    limit,
    isAdmin,
    uninvoicedOnly,
  }: {
    page: number;
    limit: number;
    isAdmin: boolean;
    uninvoicedOnly: boolean;
  }
): Promise<ListResponse<SimpleBidRequestT>> {
  const { userId, metadata } = await getTokenInfo();
  const { type } = metadata;

  const where: Prisma.BidRequestWhereInput = {};

  if (uninvoicedOnly) {
    where.status = $Enums.BidRequestStatus.ACCEPTED;
    where.invoice = {
      is: null
    };
  }

  if (isAdmin) {
    await assertAdmin();
  } else if (type === UserTypeT.Buyer) {
    where.userId = userId;
  } else if (type === UserTypeT.Creator) {
    where.bidRound = {
      webtoon: {
        userId
      }
    };
  }

  const [records, totalRecords] = await prisma.$transaction([
    prisma.bidRequest.findMany({
      where,
      include: simpleBidRequestIncludeForQuery,
      orderBy: {
        createdAt: "desc"
      },
      take: limit > 0 ? limit : undefined,
      skip: (page - 1) * limit,
    }),
    prisma.bidRequest.count({ where })
  ]);
  return {
    items: records.map(mapToSimpleBidRequestDTO),
    totalPages: Math.ceil(totalRecords / limit),
  };
}
