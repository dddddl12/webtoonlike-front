"use server";

import { BidRequest as BidRequestRecord, Prisma } from "@prisma/client";
import { BidRequestT } from "@/resources/bidRequests/bidRequest.types";
import { getUserMetadata } from "@/resources/userMetadata/userMetadata.service";
import prisma from "@/utils/prisma";


const mapToDTO = (record: BidRequestRecord): BidRequestT => ({
  ...record,
  contractRange: {
    // TODO contractRange json 검토
    data: []
  },
});


// @Injectable()
// export class BidRequestService {
//   constructor() {}
//
//   async get(id: idT, getOpt: GetBidRequestOptionT = {}): Promise<BidRequestT> {
//     return bidRequestM.findById(id, {
//       builder: (qb, select) => {
//         lookupBuilder(select, getOpt);
//       }
//     });
//   }
//
//   async list(listOpt: ListBidRequestOptionT): Promise<ListData<BidRequestT>> {
//     return await listBidRequest(listOpt);
//   }
//
//   async create(form: BidRequestFormT): Promise<BidRequestT> {
//     // TODO: Round 사용 안하고 있음
//     const round = await bidRoundM.findById(form.roundId);
//
//     if (!round) {
//       throw new err.NotExistE("bidRound not exist");
//     }
//
//     // if (round.status !== "bidding") {
//     //   throw new err.InvalidActionE("bidRound not started");
//     // }
//
//     const created = await bidRequestM.create(form);
//
//     if (!created) {
//       throw new err.NotAppliedE();
//     }
//     return created;
//   }
//
//   async update(id: idT, form: Partial<BidRequestFormT>): Promise<BidRequestT> {
//     const updated = await bidRequestM.updateOne({ id }, form);
//     if (!updated) {
//       throw new err.NotAppliedE();
//     }
//     return updated;
//   }
//
//   async remove(id: idT): Promise<BidRequestT> {
//     const deleted = await bidRequestM.deleteOne({ id });
//     if (!deleted) {
//       throw new err.NotAppliedE();
//     }
//     return deleted;
//   }
//
//   async accept(id: idT): Promise<BidRequestT> {
//     const updated = await bidRequestM.updateOne({ id }, { acceptedAt: "NOW()" as any, rejectedAt: null });
//     if (!updated) {
//       throw new err.NotAppliedE();
//     }
//     return updated;
//   }
//
//   async reject(id: idT): Promise<BidRequestT> {
//     const updated = await bidRequestM.updateOne({ id }, { rejectedAt: "NOW()" as any, acceptedAt: null });
//     if (!updated) {
//       throw new err.NotAppliedE();
//     }
//     return updated;
//   }
//
//   async cancel(id: idT): Promise<BidRequestT> {
//     const updated = await bidRequestM.updateOne({ id }, { cancelledAt: "NOW()" as any });
//     if (!updated) {
//       throw new err.NotAppliedE();
//     }
//     return updated;
//   }
//
//   async approve(id: idT): Promise<BidRequestT> {
//     const updated = await bidRequestM.updateOne({ id }, { updatedAt: "NOW()" as any });
//     if (!updated) {
//       throw new err.NotAppliedE();
//     }
//     return updated;
//   }
// }

export async function listBidRequests({
  page = 1,
  limit = 10
}: {
  page?: number;
  limit?: number;
} = {}): Promise<{
    items: BidRequestT[];
    totalPages: number;
  }> {
  const { id: userId } = await getUserMetadata();

  const where: Prisma.BidRequestWhereInput = {
    // userId
  //   TODO
  };

  const [records, totalRecords] = await prisma.$transaction([
    prisma.bidRequest.findMany({
      where,
      include: {
        round: {
          include: {
            webtoon: true
          }
        },
        BidRequestMessage: true
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.bidRequest.count({ where })
  ]);
  return {
    items: records.map(mapToDTO),
    totalPages: Math.ceil(totalRecords / limit),
  };
}