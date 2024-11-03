"use server";

// on every 24 hours
// @Cron("0 0 * * * *") TODO
import { BidRoundStatus, BidRoundT, ContractRange } from "@/resources/bidRounds/bidRound.types";
import { BidRound as BidRoundRecord } from "@prisma/client";
