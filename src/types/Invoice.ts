export type InvoiceFormT = {
    requestId: number;
    creatorUid: number | null;
    buyerUid: number | null;
    dataUri: string;
}

type _InvoiceT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    requestId: number;
    creatorUid: number | null;
    buyerUid: number | null;
    dataUri: string;
}

export type GetInvoiceOptionT = {
    meId?: (number | undefined) | undefined;
    $request?: boolean | undefined;
    $webtoon?: boolean | undefined;
    $creator?: boolean | undefined;
    $buyer?: boolean | undefined;
}

export type ListInvoiceOptionT = {
    cursor?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    $numData?: boolean | undefined;
    meId?: ((number | undefined) | undefined) | undefined;
    $request?: (boolean | undefined) | undefined;
    $webtoon?: (boolean | undefined) | undefined;
    $creator?: (boolean | undefined) | undefined;
    $buyer?: (boolean | undefined) | undefined;
    creatorUid?: number | undefined;
    buyerUid?: number | undefined;
}


// @type-gen remain
import { BidRequestT } from "./BidRequest";
import { WebtoonT } from "./Webtoon";
import { BuyerT } from "./Buyer";
import { CreatorT } from "./Creator";


export interface InvoiceT extends _InvoiceT {
    request?: BidRequestT;
    webtoon?: WebtoonT;
    creator?: CreatorT;
    buyer?: BuyerT;
}