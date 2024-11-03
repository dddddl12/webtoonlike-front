import { BidRequestExtendedT } from "@/resources/bidRequests/bidRequest.types";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { Gap } from "@/ui/layouts";
import { Link } from "@/i18n/routing";
import BidRequestMessageList from "@/app/[locale]/creator/bid-requests/BidRequestMessageList";

export function BidRequestRow({ bidRequest }:{
  bidRequest: BidRequestExtendedT
}) {
  const locale = useLocale();
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const TbidRequestStatus = useTranslations("bidRequestStatus");
  const { webtoon } = bidRequest;
  return (
    <>
      <div className="flex p-2 mt-4 text-white rounded-md bg-black-texts items-center">
        <div className="w-[40%] p-2 flex justify-start items-center">
          <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
            <Image
              src={buildImgUrl(null, webtoon.thumbPath, { size: "xs" })}
              alt={webtoon.thumbPath}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={4} />
          <Link
            className="underline cursor-pointer"
            href={`/webtoons/${webtoon?.id}`}>
            {locale === "ko" ? webtoon?.title : webtoon?.title_en ?? webtoon?.title}
          </Link>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequest.createdAt.toLocaleString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <span className="underline text-mint cursor-pointer"
            onClick={(e) => setShowMessages(prev => !prev)}>협상 내역 보기</span>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {/*{TbidRequestStatus(bidRequest.round?.status)}*/}
          상태
        </div>
      </div>
      {showMessages
        && <BidRequestMessageList bidRequestId={bidRequest.id}/>}
    </>
  );
}

