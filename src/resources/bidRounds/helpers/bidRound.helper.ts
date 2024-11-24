import "server-only";
import { $Enums, BidRound as BidRoundRecord, Prisma } from "@prisma/client";
import {
  BidRoundApprovalStatus,
  BidRoundStatus,
  BidRoundT,
  ContractRange
} from "@/resources/bidRounds/dtos/bidRound.dto";
import { getBidRoundStatus } from "@/resources/bidRounds/bidRoundStatus";

class BidRoundHelper {
  offerableBidRoundWhere = () => {
    const now = new Date();
    return Prisma.validator<Prisma.BidRoundWhereInput>()({
      isActive: true,
      approvalStatus: $Enums.BidRoundApprovalStatus.APPROVED,
      bidStartsAt: {
        lte: now
      }
    });
  };

  getStatusFromRecord = (record: Prisma.BidRoundGetPayload<{
    select: {
      bidStartsAt: true;
      negoStartsAt: true;
      processEndsAt: true;
      approvalStatus: true;
    };
  }>): BidRoundStatus => {
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
}

const bidRoundHelper = new BidRoundHelper();
export default bidRoundHelper;
