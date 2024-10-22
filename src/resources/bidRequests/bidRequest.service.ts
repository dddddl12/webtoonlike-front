import { Injectable } from "@nestjs/common";
import { bidRequestM } from "@/models/bidRequests";
import { bidRoundM } from "@/models/bidRounds";
import * as err from "@/errors";
import { lookupBuilder } from "./fncs/lookup_builder";
import { listBidRequest } from "./fncs/list_bid_request";
import type { BidRequestFormT, BidRequestT, GetBidRequestOptionT, ListBidRequestOptionT } from "@/types";


@Injectable()
export class BidRequestService {
  constructor() {}

  async get(id: idT, getOpt: GetBidRequestOptionT = {}): Promise<BidRequestT> {
    return bidRequestM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    });
  }

  async list(listOpt: ListBidRequestOptionT): Promise<ListData<BidRequestT>> {
    return await listBidRequest(listOpt);
  }

  async create(form: BidRequestFormT): Promise<BidRequestT> {
    // TODO: Round 사용 안하고 있음
    const round = await bidRoundM.findById(form.roundId);

    if (!round) {
      throw new err.NotExistE("bidRound not exist");
    }

    // if (round.status !== "bidding") {
    //   throw new err.InvalidActionE("bidRound not started");
    // }

    const created = await bidRequestM.create(form);

    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<BidRequestFormT>): Promise<BidRequestT> {
    const updated = await bidRequestM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async remove(id: idT): Promise<BidRequestT> {
    const deleted = await bidRequestM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async accept(id: idT): Promise<BidRequestT> {
    const updated = await bidRequestM.updateOne({ id }, { acceptedAt: "NOW()" as any, rejectedAt: null });
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async reject(id: idT): Promise<BidRequestT> {
    const updated = await bidRequestM.updateOne({ id }, { rejectedAt: "NOW()" as any, acceptedAt: null });
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async cancel(id: idT): Promise<BidRequestT> {
    const updated = await bidRequestM.updateOne({ id }, { cancelledAt: "NOW()" as any });
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async approve(id: idT): Promise<BidRequestT> {
    const updated = await bidRequestM.updateOne({ id }, { updatedAt: "NOW()" as any });
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }
}