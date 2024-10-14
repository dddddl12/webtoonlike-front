import { server } from "@/system/axios";
import type * as R from "@backend/types/BidRequest.api";
import type { BidRequestFormT, GetBidRequestOptionT, ListBidRequestOptionT } from "@backend/types/BidRequest";

const root = "/bid-requests";

// (POST) /
export async function create(form: BidRequestFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}/`, body);
  return rsp.data;
}

// (GET) /:id
export async function get(id: number, getOpt: GetBidRequestOptionT): Promise<R.GetRsp> {
  const params: GetBidRequestOptionT = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

// (GET) /
export async function list(listOpt: ListBidRequestOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}/`, { params });
  return rsp.data;
}

// (DELETE) /:id
export async function del(id: number): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

// (PATCH) /:id
export async function update(id: number, form: Partial<BidRequestFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

// (POST) /accept
export async function accept(rqs: R.AcceptRqs): Promise<R.AcceptRsp> {
  const rsp = await server.post(`${root}/accept`, rqs);
  return rsp.data;
}

// (POST) /reject
export async function reject(rqs: R.RejectRqs): Promise<R.RejectRsp> {
  const rsp = await server.post(`${root}/reject`, rqs);
  return rsp.data;
}

// *USER (POST) /cancel
export async function cancel(rqs: R.CancelRqs): Promise<R.CancelRsp> {
  const rsp = await server.post(`${root}/cancel`, rqs);
  return rsp.data;
}

// *ADMIN (POST) /publish-invoice
export async function publishInvoice(requestId: number): Promise<R.PublishInvoiceRsp> {
  const body: R.PublishInvoiceRqs = { requestId };
  const rsp = await server.post(`${root}/publish-invoice`, body);
  return rsp.data;
}

// *ADMIN (POST) /confirm-invoice
export async function confirmInvoice(requestId: number, base64data: string): Promise<R.ConfirmInvoiceRsp> {
  const body: R.ConfirmInvoiceRqs = { requestId, base64data };
  const rsp = await server.post(`${root}/confirm-invoice`, body);
  return rsp.data;
}