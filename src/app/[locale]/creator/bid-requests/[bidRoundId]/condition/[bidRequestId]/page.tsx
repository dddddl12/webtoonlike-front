import { CreatorBidRequestConditionPage } from "@/$pages/creators/CreatorBidRequestConditionPage";
import { tokenHolder } from "@/system/token_holder";
import { Container } from "@/ui/layouts";
import { cookies } from "next/headers";
import { ErrorComponent } from "@/components/ErrorComponent";

export default async function Condition({
  params,
}: {
  params: { bidRequestId: string };
}) {
  const bidRequestsId = params.bidRequestId;
  try {
    const { data: bidRequestDetail } =
      await tokenHolder.serverFetchWithCredential(cookies, async () => {
        return BidRequestsApi.get(parseInt(bidRequestsId), {
          $round: true,
          $buyer: true,
          $webtoon: true,
          $creator: true,
        });
      });
    return (
      <div className="bg-[#121212] min-h-screen">
        <Container>
          <CreatorBidRequestConditionPage bidRequestDetail={bidRequestDetail} />
        </Container>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <ErrorComponent />;
  }
}
