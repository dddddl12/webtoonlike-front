// import { Injectable } from "@nestjs/common";
// import * as err from "@/errors";
// import { invoiceM } from "@/models/invoices";
// import { listInvoice } from "./fncs/list_invoice";
// import { lookupBuilder } from "./fncs/lookup_builder";
// import { InvoiceT, InvoiceFormT, GetInvoiceOptionT, ListInvoiceOptionT } from "@/types";
//
// @Injectable()
// export class InvoiceService {
//   constructor() {}
//
//   async get(id: idT, getOpt: GetInvoiceOptionT = {}): Promise<InvoiceT> {
//     const fetched = await invoiceM.findOne({ id }, {
//       builder: (qb, select) => {
//         lookupBuilder(select, getOpt);
//       }
//     });
//     if (!fetched) {
//       throw new err.NotExistE();
//     }
//     return fetched;
//   }
//
//   async create(form: InvoiceFormT): Promise<InvoiceT> {
//     const created = await invoiceM.create(form);
//     if (!created) {
//       throw new err.NotAppliedE();
//     }
//     return created;
//   }
//
//   async list(listOpt: ListInvoiceOptionT): Promise<ListData<InvoiceT>> {
//     return await listInvoice(listOpt);
//   }
//
// }