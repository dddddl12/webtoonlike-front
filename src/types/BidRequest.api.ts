import type {
  BidRequestFormT, BidRequestT, GetBidRequestOptionT, ListBidRequestOptionT,
} from "./BidRequest";
import { InvoiceT } from "./Invoice";

// root = /bid-requests

// (POST) /
export type CreateRqs = {form: BidRequestFormT}
export type CreateRsp = BidRequestT

// (GET) /
export type ListRqs = ListBidRequestOptionT
export type ListRsp = ListData<BidRequestT>

// (GET) /:id
export type GetRqs = GetBidRequestOptionT
export type GetRsp = GetData<BidRequestT>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<BidRequestFormT>}
export type UpdateRsp = BidRequestT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = BidRequestT


// (POST) /accept
export type AcceptRqs = {id: idT}
export type AcceptRsp = BidRequestT

// (POST) /reject
export type RejectRqs = {id: idT}
export type RejectRsp = BidRequestT

// *USER (POST) /cancel
export type CancelRqs = {id: idT}
export type CancelRsp = BidRequestT

// *ADMIN (POST) /publish-invoice
export type PublishInvoiceRqs = { requestId: idT }
export type PublishInvoiceRsp = { base64data: string }

// *ADMIN (POST) /confirm-invoice
export type ConfirmInvoiceRqs = { requestId: idT, base64data: string }
export type ConfirmInvoiceRsp = InvoiceT