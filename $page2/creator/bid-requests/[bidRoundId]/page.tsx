import { tokenHolder } from "@/system/token_holder";
import { cookies } from "next/headers";
import { CreatorBidRequestDetailPage } from "../../../../$pages/creators/CreatorBidRequestDetailPage";
import { ErrorComponent } from "@/components/ErrorComponent";

export default async function BidRequest({ params }: { params: { bidRoundId: string } }) {
  try {
    const { data: bidRounds } = await tokenHolder.serverFetchWithCredential(cookies, async () => {
      return BidRoundsApi.get(parseInt(params.bidRoundId), { $webtoon: true, $user: true, $requests: true });
    });
    return (
      <div className="bg-[#121212] min-h-screen">
        <CreatorBidRequestDetailPage bidRound={bidRounds} />
      </div>
    );
  } catch (e){
    console.log(e);
    return (
      <ErrorComponent />
    );
  }
}
