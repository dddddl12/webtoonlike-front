import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import BidRequestMessageList from "@/app/[locale]/offers/BidRequestMessageList";
import { BidRequestStatus } from "@/resources/bidRequests/dtos/bidRequest.dto";
import StatusBadge from "@/components/ui/StatusBadge";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { BidRequestWithMetaDataT } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";

// TODO 아코디언 적용
export default function BidRequestListRow({ bidRequest }:{
  bidRequest: BidRequestWithMetaDataT;
}) {
  const locale = useLocale();
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [curBidRequest, setCurBidRequest] = useState<BidRequestWithMetaDataT>(bidRequest);

  const { webtoon } = curBidRequest;
  return (
    <>
      <div className="flex p-2 mt-4 text-white rounded-md bg-black-texts items-center">
        <div className="w-[40%] p-2 flex justify-start items-center">
          <WebtoonAvatar webtoon={webtoon}/>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {curBidRequest.createdAt.toLocaleString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <span className="clickable"
            onClick={() => setShowMessages(prev => !prev)}>협상 내역 보기</span>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <BidRequestStatusBadge status={curBidRequest.status}/>
        </div>
      </div>
      {showMessages
        && <BidRequestMessageList
          curBidRequest={curBidRequest}
          setCurBidRequest={setCurBidRequest}/>}
    </>
  );
}

function BidRequestStatusBadge({ status }:{
  status: BidRequestStatus;
}) {
  const TbidRequestStatus = useTranslations("bidRequestStatus");
  const content = TbidRequestStatus(status);
  switch (status) {
    case BidRequestStatus.Pending:
      return <StatusBadge variant="yellow" content={content} />;
    case BidRequestStatus.Declined:
      return <StatusBadge variant="red" content={content} />;
    case BidRequestStatus.Accepted:
      return <StatusBadge variant="mint" content={content} />;
    default:
      throw new Error(status);
  }
}
