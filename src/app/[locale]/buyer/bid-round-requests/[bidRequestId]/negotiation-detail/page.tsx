// import { BuyerNegotiationDetailPage } from "@/$pages/buyers/BuyerNegotiationDetailPage";
import { cookies } from "next/headers";
import { ErrorComponent } from "@/components/ErrorComponent";

export default async function NegotiationDetail({ params }: { params: { bidRequestId: string }}) {
  return <></>;
  // const bidRequestId = params.bidRequestId;
  // try {
  //   const { data: bidRequestDetail } = await tokenHolder.serverFetchWithCredential(cookies, async () => {
  //     return BidRequestApi.get(parseInt(bidRequestId), { $webtoon: true, $round: true, $buyer: true, $creator: true });
  //   });
  //   return (
  //     <div className="bg-[#121212] min-h-screen">
  //       <BuyerNegotiationDetailPage bidRequest={bidRequestDetail} />
  //     </div>
  //   );
  // } catch (e){
  //   console.log(e);
  //   return (
  //     <ErrorComponent />
  //   );
  // }
}
