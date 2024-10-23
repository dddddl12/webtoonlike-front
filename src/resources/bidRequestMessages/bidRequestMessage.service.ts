// import { Injectable } from "@nestjs/common";
// import { bidRequestMessageM } from "@/models/bidRequestMessages";
// import { listBidRequestMessage } from "./fncs/list_bid_request_message";
// import type {
//   BidRequestMessageFormT, BidRequestMessageT, ListBidRequestMessageOptionT,
// } from "@/types/bidRequestMessages";
//
// @Injectable()
// export class BidRequestMessageService {
//   constructor() {}
//
//   async create(form: BidRequestMessageFormT ): Promise<BidRequestMessageT> {
//     return bidRequestMessageM.create(form);
//   }
//
//   async list(listOpt: ListBidRequestMessageOptionT): Promise<ListData<BidRequestMessageT>> {
//     return listBidRequestMessage(listOpt);
//   }
// }