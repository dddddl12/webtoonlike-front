import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { Gap } from "@/shadcn/ui/layouts";
import { Link } from "@/i18n/routing";
import BidRequestMessageList from "@/app/[locale]/offers/BidRequestMessageList";
import { displayName } from "@/utils/displayName";
import { SimpleBidRequestT } from "@/resources/bidRequests/bidRequest.controller";
import { BidRequestStatus } from "@/resources/bidRequests/bidRequest.types";
import StatusBadge from "@/components/StatusBadge";

// TODO 아코디언 적용
export default function BidRequestListRow({ bidRequest }:{
  bidRequest: SimpleBidRequestT;
}) {
  const locale = useLocale();
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [curBidRequest, setCurBidRequest] = useState<SimpleBidRequestT>(bidRequest);

  const { webtoon } = curBidRequest;
  return (
    <>
      <div className="flex p-2 mt-4 text-white rounded-md bg-black-texts items-center">
        <div className="w-[40%] p-2 flex justify-start items-center">
          <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
            <Image
              src={buildImgUrl(webtoon.thumbPath, { size: "xs" })}
              alt={webtoon.thumbPath}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={4} />
          <Link
            className="underline cursor-pointer"
            href={`/webtoons/${webtoon.id}`}>
            {displayName(locale, webtoon.title, webtoon.title_en)}
          </Link>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {curBidRequest.createdAt.toLocaleString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <span className="underline text-mint cursor-pointer"
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
