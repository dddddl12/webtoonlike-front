import { server } from "@/system/axios";
import type * as R from "@backend/types/BidRound.api";
import type { BidRoundT, BidRoundFormT, GetBidRoundOptionT, ListBidRoundOptionT } from "@/types";

const root = "/bid-rounds";

// (POST) /
export async function create(form: BidRoundFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}/`, body);
  return rsp.data;
}

// (GET) /
export async function list(listOpt: ListBidRoundOptionT ): Promise<R.ListRsp> {
  const params:R.ListRqs = listOpt;
  const rsp = await server.get(`${root}/`, { params });
  return rsp.data;
}

// (GET) /:id
export async function get(id: idT, getOpt: GetBidRoundOptionT): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

// (PATCH) /:id
export async function update(id: idT, form: Partial<BidRoundFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

// *ADMIN (POST) /approve
export async function approve(id: idT): Promise<R.ApproveRsp> {
  const body: R.ApproveRqs = { id };
  const rsp = await server.post(`${root}/approve`, body);
  return rsp.data;
}

// *ADMIN (POST) /disapprove
export async function disapprove(id: idT, adminMemo: string): Promise<R.DisapproveRsp> {
  const body: R.DisapproveRqs = { id, adminMemo };
  const rsp = await server.post(`${root}/disapprove`, body);
  return rsp.data;
}