export type BidRequestFormT = {
    userId: number | null;
    roundId: number;
    message?: (string | null) | undefined;
    contractRange: {
        data: {
            contract: "exclusive" | "nonExclusive" | "disallow";
            businessField: "all" | "webtoon" | "movie" | "drama" | "webDrama" | "ads" | "musical" | "game" | "book" | "product";
            country: "all" | "ko" | "en" | "zhCN" | "zhTW" | "de" | "id" | "ja" | "fr" | "vi" | "ms" | "th" | "es";
            message: string;
        }[];
    };
    /** creator acceptance */
    acceptedAt?: (Date | null) | undefined;
    /** creator rejection */
    rejectedAt?: (Date | null) | undefined;
    /** admin approval */
    approvedAt?: (Date | null) | undefined;
    /** user cancel bid request */
    cancelledAt?: (Date | null) | undefined;
}

type _BidRequestT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    userId: number | null;
    roundId: number;
    message?: (string | null) | undefined;
    contractRange: {
        data: {
            contract: "exclusive" | "nonExclusive" | "disallow";
            businessField: "all" | "webtoon" | "movie" | "drama" | "webDrama" | "ads" | "musical" | "game" | "book" | "product";
            country: "all" | "ko" | "en" | "zhCN" | "zhTW" | "de" | "id" | "ja" | "fr" | "vi" | "ms" | "th" | "es";
            message: string;
        }[];
    };
    /** creator acceptance */
    acceptedAt?: (Date | null) | undefined;
    /** creator rejection */
    rejectedAt?: (Date | null) | undefined;
    /** admin approval */
    approvedAt?: (Date | null) | undefined;
    /** user cancel bid request */
    cancelledAt?: (Date | null) | undefined;
}

export type GetBidRequestOptionT = {
    meId?: (number | undefined) | undefined;
    $round?: boolean | undefined;
    $webtoon?: boolean | undefined;
    $buyer?: boolean | undefined;
    $creator?: boolean | undefined;
    $invoice?: boolean | undefined;
}

export type ListBidRequestOptionT = {
    cursor?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    $numData?: boolean | undefined;
    meId?: ((number | undefined) | undefined) | undefined;
    $round?: (boolean | undefined) | undefined;
    $webtoon?: (boolean | undefined) | undefined;
    $buyer?: (boolean | undefined) | undefined;
    $creator?: (boolean | undefined) | undefined;
    $invoice?: (boolean | undefined) | undefined;
    userId?: number | undefined;
    roundId?: number | undefined;
    status?: ("accepted" | "rejected") | undefined;
    approved?: ("only" | "except") | undefined;
    mine?: ("only" | "except") | undefined;
}


// @type-gen remain
import { BidRoundT } from "./BidRound";
import { WebtoonT } from "./Webtoon";
import { BuyerT } from "./Buyer";
import { CreatorT } from "./Creator";
import { InvoiceT } from "./Invoice";

export interface BidRequestT extends _BidRequestT {
  round?: BidRoundT;
  webtoon?: WebtoonT;
  buyer?: BuyerT;
  creator?: CreatorT;
  invoice?: InvoiceT;
}