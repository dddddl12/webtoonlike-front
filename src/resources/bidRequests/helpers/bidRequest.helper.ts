import "server-only";
import { BidRequest as BidRequestRecord, Prisma } from "@prisma/client";
import { BidRequestSchema, BidRequestStatus, BidRequestT } from "@/resources/bidRequests/dtos/bidRequest.dto";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { AdminLevel } from "@/resources/tokens/token.types";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { UnexpectedServerError } from "@/handlers/errors";

class BidRequestHelper {
  mapToDTO = (record: BidRequestRecord): BidRequestT => {
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

  async whereWithReadAccess(): Promise<Prisma.BidRequestWhereInput>;
  async whereWithReadAccess(bidRequestId: number): Promise<Prisma.BidRequestWhereUniqueInput>;
  async whereWithReadAccess(bidRequestId?: number): Promise<Prisma.BidRequestWhereInput | Prisma.BidRequestWhereUniqueInput> {
    const { userId, metadata } = await getTokenInfo();
    const where: Prisma.BidRequestWhereInput | Prisma.BidRequestWhereUniqueInput = {
      // TODO 체크
      id: bidRequestId,
    };
    if (metadata.adminLevel >= AdminLevel.Admin) {
      return where;
    }
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
    return where;
  };
}

const bidRequestHelper = new BidRequestHelper();
export default bidRequestHelper;