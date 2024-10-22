import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { knex } from "@/global/db";
import { bidRoundM } from "@/models/bidRounds";
import * as err from "@/errors";
import { addMonths, startOfMonth } from "date-fns";
import { lookupBuilder } from "./fncs/lookup_builder";
import { listBidRound } from "./fncs/list_bid_round";
import type { BidRoundT, BidRoundFormT, GetBidRoundOptionT, ListBidRoundOptionT } from "@/types";

@Injectable()
export class BidRoundService {
  constructor() {}

  // on every 24 hours
  @Cron("0 0 * * * *")
  async handleCron() {
    console.log("running cron job for bid round");

    // update status to "bidding"
    const watingRounds = await bidRoundM.find({
      builder: (qb) => {
        qb.where("status", "waiting")
          .andWhere("bidStartAt", "<=", new Date());
      }
    });
    if (watingRounds.length > 0) {
      await knex.update({ status: "bidding" })
        .from(bidRoundM.table)
        .whereIn("id", watingRounds.map((r) => r.id));
    }

    // update status to "negotiating"
    const biddingRounds = await bidRoundM.find({
      builder: (qb) => {
        qb.where("status", "bidding")
          .andWhere("negoStartAt", "<=", new Date());
      }
    });
    if (biddingRounds.length > 0) {
      await knex.update({ status: "negotiating" })
        .from(bidRoundM.table)
        .whereIn("id", biddingRounds.map((r) => r.id));
    }

    const negotiatingRounds = await bidRoundM.find({
      builder: (qb) => {
        qb.where("status", "negotiating")
          .andWhere("processEndAt", "<=", new Date());
      }
    });

    if (negotiatingRounds.length > 0) {
      await knex.update({ status: "done" })
        .from(bidRoundM.table)
        .whereIn("id", negotiatingRounds.map((r) => r.id));
    }
  }

  async get(id: idT, getOpt: GetBidRoundOptionT = {}): Promise<BidRoundT> {
    return bidRoundM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    });
  }

  async list(listOpt: ListBidRoundOptionT): Promise<ListData<BidRoundT>> {
    return await listBidRound(listOpt);
  }

  async create(form: BidRoundFormT): Promise<BidRoundT> {
    const item = await bidRoundM.findOne({ webtoonId: form.webtoonId }, {
      builder: (qb) => {
        qb.orderBy("createdAt", "desc");
      }
    });

    if (item) {
      throw new err.AlreadyExistE();
    }

    const created = await bidRoundM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<BidRoundFormT>): Promise<BidRoundT> {
    const updated = await bidRoundM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async approve(id: idT): Promise<BidRoundT> {
    const today = new Date(); // Gets today's date
    const nextMonth = addMonths(today, 1); // Adds one month to today

    const bidStartAt = startOfMonth(nextMonth); // Gets the first date of the next month
    const negoStartAt = addMonths(bidStartAt, 1);
    const processEndAt = addMonths(negoStartAt, 1);

    const updated = await bidRoundM.updateOne({ id }, {
      approvedAt: today,
      disapprovedAt: null,
      status: "waiting",
      bidStartAt,
      negoStartAt,
      processEndAt,
    });
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async disapprove(id: idT, adminMemo: string): Promise<BidRoundT> {
    const updated = await bidRoundM.updateOne({ id }, {
      approvedAt: null,
      disapprovedAt: new Date(),
      status: "idle",
      adminMemo,
      bidStartAt: null,
      negoStartAt: null,
    });
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }
}