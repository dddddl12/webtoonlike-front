import { BuyerBidRoundItemDetail } from "@/$pages/buyers/BuyerBidRoundRequestListPage/BuyerBidRoundList/BuyerBidRoundListItem/BuyerBidRoundItemDetail";
import { tokenHolder } from "@/system/token_holder";
import * as BidRoundsApi from "@/apis/bid_rounds";
import * as WebtoonsApi from "@/apis/webtoons";
import { cookies } from "next/headers";

export default async function CreateBidRoundRequestPage({ params }: { params: { bidRoundId: string } }) {
  try {
    const { data: bidRound } = await tokenHolder.serverFetchWithCredential(cookies, async () => {
      return BidRoundsApi.get(parseInt(params.bidRoundId), { $webtoon: true, $user: true });
    });

    const { data: webtoon } = await tokenHolder.serverFetchWithCredential(cookies, async () => {
      return WebtoonsApi.get(bidRound?.webtoonId, { $numEpisode: true });
    });

    return (
      <div className="bg-[#121212] min-h-screen">
        <BuyerBidRoundItemDetail bidRound={bidRound} webtoon={webtoon} />
      </div>
    );
  } catch (e) {
    console.log(e);
    return (
      <div>error</div>
    );
  }
}
