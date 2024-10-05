// // (GET) /
// export type ListRqs = ListInvoiceOptionT
// export type ListRsp = ListData<InvoiceT>;

import { server } from "@/system/axios";
import type * as R from "@/types/Invoice.api";
import type { InvoiceT, ListInvoiceOptionT } from "@/types";

const root = "/invoices";

// (GET) /
export async function list(opt: ListInvoiceOptionT): Promise<R.ListRsp> {
  const rsp = await server.get(`${root}/`, { params: opt });
  return rsp.data;
}