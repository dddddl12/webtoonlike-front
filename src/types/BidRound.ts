export type BidRoundFormT = {
    userId: number | null;
    webtoonId: number;
    isWebtoon?: (boolean | null) | undefined;
    isSecondary?: (boolean | null) | undefined;
    contractRange: {
        data: {
            contract: "exclusive" | "nonExclusive" | "disallow";
            businessField: "all" | "webtoon" | "movie" | "drama" | "webDrama" | "ads" | "musical" | "game" | "book" | "product";
            country: "all" | "ko" | "en" | "zhCN" | "zhTW" | "de" | "id" | "ja" | "fr" | "vi" | "ms" | "th" | "es";
        }[];
    };
    originality: "original" | "notOriginal";
    isBrandNew: boolean;
    numEpisode?: (number | null) | undefined;
    nowEpisode?: (number | null) | undefined;
    monthlyNumEpisode?: (number | null) | undefined;
    status: "idle" | "waiting" | "bidding" | "negotiating" | "done";
    bidStartAt?: (Date | null) | undefined;
    negoStartAt?: (Date | null) | undefined;
    processEndAt?: (Date | null) | undefined;
    approvedAt?: (Date | null) | undefined;
    disapprovedAt?: (Date | null) | undefined;
    adminMemo?: (string | null) | undefined;
}

type _BidRoundT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    userId: number | null;
    webtoonId: number;
    isWebtoon?: (boolean | null) | undefined;
    isSecondary?: (boolean | null) | undefined;
    contractRange: {
        data: {
            contract: "exclusive" | "nonExclusive" | "disallow";
            businessField: "all" | "webtoon" | "movie" | "drama" | "webDrama" | "ads" | "musical" | "game" | "book" | "product";
            country: "all" | "ko" | "en" | "zhCN" | "zhTW" | "de" | "id" | "ja" | "fr" | "vi" | "ms" | "th" | "es";
        }[];
    };
    originality: "original" | "notOriginal";
    isBrandNew: boolean;
    numEpisode?: (number | null) | undefined;
    nowEpisode?: (number | null) | undefined;
    monthlyNumEpisode?: (number | null) | undefined;
    status: "idle" | "waiting" | "bidding" | "negotiating" | "done";
    bidStartAt?: (Date | null) | undefined;
    negoStartAt?: (Date | null) | undefined;
    processEndAt?: (Date | null) | undefined;
    approvedAt?: (Date | null) | undefined;
    disapprovedAt?: (Date | null) | undefined;
    adminMemo?: (string | null) | undefined;
}

export type GetBidRoundOptionT = {
    meId?: (number | undefined) | undefined;
    $webtoon?: boolean | undefined;
    $user?: boolean | undefined;
    $requests?: boolean | undefined;
}

export type ListBidRoundOptionT = {
    cursor?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    $numData?: boolean | undefined;
    meId?: ((number | undefined) | undefined) | undefined;
    $webtoon?: (boolean | undefined) | undefined;
    $user?: (boolean | undefined) | undefined;
    $requests?: (boolean | undefined) | undefined;
    userId?: number | undefined;
    webtoonId?: number | undefined;
    /** pass comma separated string for array of status */
    status?: (("idle" | "waiting" | "bidding" | "negotiating" | "done") | string) | undefined;
    approval?: ("approvedOnly" | "disapprovedOnly" | "waitingApproval" | "exceptApproved" | "exceptDisapproved") | undefined;
}


// @type-gen remain
import type { WebtoonT } from "./Webtoon";
import type { UserT } from "./User";
import type { BidRequestT } from "./BidRequest";

export interface BidRoundT extends _BidRoundT {
  webtoon?: WebtoonT;
  user?: UserT|null;
  requests?: BidRequestT[];
}