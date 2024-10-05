import { InvoiceT, ListInvoiceOptionT } from "./Invoice";


// (GET) /
export type ListRqs = ListInvoiceOptionT
export type ListRsp = ListData<InvoiceT>;
