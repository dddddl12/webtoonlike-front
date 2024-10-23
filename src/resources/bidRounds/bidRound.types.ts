import { WebtoonT } from "@/resources/webtoons/webtoon.types";
import { UserT } from "@/resources/users/user.types";
import { BidRequestT } from "@/resources/bidRequests/bidRequest.types";

export enum BidRoundStatus {
  Idle = "IDLE",
  Waiting = "WAITING",
  Bidding = "BIDDING",
  Negotiating = "NEGOTIATING",
  Done = "DONE",
}

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
  isOriginal: boolean;
  isBrandNew: boolean;
  numEpisode?: (number | null) | undefined;
  nowEpisode?: (number | null) | undefined;
  monthlyNumEpisode?: (number | null) | undefined;
  status: BidRoundStatus;
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
  updatedAt: Date;
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
  isOriginal: boolean;
  isBrandNew: boolean;
  numEpisode?: (number | null) | undefined;
  nowEpisode?: (number | null) | undefined;
  monthlyNumEpisode?: (number | null) | undefined;
  status: BidRoundStatus;
  bidStartAt?: (Date | null) | undefined;
  negoStartAt?: (Date | null) | undefined;
  processEndAt?: (Date | null) | undefined;
  approvedAt?: (Date | null) | undefined;
  disapprovedAt?: (Date | null) | undefined;
  adminMemo?: (string | null) | undefined;
}

export interface BidRoundT extends _BidRoundT {
  webtoon?: WebtoonT;
  user?: UserT;
  requests?: BidRequestT[];
}