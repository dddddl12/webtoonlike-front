import type {
  BidRequestMessageT, BidRequestMessageFormT, ListBidRequestMessageOptionT,
} from "./BidRequestMessage";

// (POST) /
export type CreateRqs = {form: BidRequestMessageFormT}
export type CreateRsp = BidRequestMessageT

// (GET) /
export type ListRqs = ListBidRequestMessageOptionT
export type ListRsp = ListData<BidRequestMessageT>