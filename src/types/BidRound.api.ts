import type { BidRoundFormT, BidRoundT, GetBidRoundOptionT, ListBidRoundOptionT } from "./BidRound";

// root = /bid-rounds

// (POST) /
export type CreateRqs = {form: BidRoundFormT}
export type CreateRsp = BidRoundT

// (GET) /
export type ListRqs = ListBidRoundOptionT
export type ListRsp = ListData<BidRoundT>

// (GET) /:id
export type GetRqs = GetBidRoundOptionT
export type GetRsp = GetData<BidRoundT>

// *OWNER OR ADMIN (PATCH) /:id
export type UpdateRqs = {form: Partial<BidRoundFormT>}
export type UpdateRsp = BidRoundT


// *ADMIN (POST) /approve
export type ApproveRqs = {id: idT}
export type ApproveRsp = BidRoundT

// *ADMIN (POST) /disapprove
export type DisapproveRqs = {id: idT, adminMemo: string}
export type DisapproveRsp = BidRoundT
