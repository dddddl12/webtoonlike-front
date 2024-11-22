"use client";

import { Col, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Paginator from "@/components/Paginator";
import useListData from "@/hooks/listData";
import { ListResponse } from "@/resources/globalTypes";
import { displayName } from "@/utils/displayName";
import { useState } from "react";
import BidRequestDetailsForInvoice from "@/app/[locale]/invoices/BidRequestDetailsForInvoice";
import { listUninvoicedBidRequests, SimpleBidRequestT } from "@/resources/bidRequests/bidRequest.controller";

export function UninvoicedBidRequestList({ initialBidRequestListResponse }: {
  initialBidRequestListResponse: ListResponse<SimpleBidRequestT>;
}) {
  const t = useTranslations("invoiceManagement");
  const { listResponse, filters, setFilters } = useListData(
    listUninvoicedBidRequests,
    { page: 1 },
    initialBidRequestListResponse
  );

  if (listResponse.items.length === 0) {
    return <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
      <Text className="text-white">인보이스 발행 대기 중인 오퍼가 없습니다.</Text>
    </Row>;
  }

  return <>
    <Col>
      <TableHeader />
      {listResponse.items.map((bidRequest) => (
        <TableRow key={bidRequest.id} bidRequest={bidRequest} />
      ))}
    </Col>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}


function TableHeader() {
  const t = useTranslations("invoiceManagement");
  return (
    <div className="flex p-2 text-white">
      <div className="w-[20%] p-2 flex justify-start font-bold">{t("seriesName")}</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("authorName")}</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("buyerName")}</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">협상 개요</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">신청 일자</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("downloadInvoice")}</div>
    </div>
  );
}

function TableRow({ bidRequest }: { bidRequest: SimpleBidRequestT }) {
  const locale = useLocale();
  const [showNegotiation, setShowNegotiation] = useState(false);
  const t = useTranslations("invoiceManagement");

  return (
    <>
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[20%] p-2 flex justify-start items-center">
          <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
            <Image
              src={buildImgUrl(bidRequest.webtoon.thumbPath, { size: "xxs" })}
              alt={bidRequest.webtoon.thumbPath}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Link
            className="text-mint underline cursor-pointer ml-4"
            href={`/webtoons/${bidRequest.webtoon.id}`}
          >
            {displayName(locale, bidRequest.webtoon.title, bidRequest.webtoon.title_en)}
          </Link>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequest.creator.user.name}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequest.buyer.user.name}
        </div>

        <div className="w-[20%] p-2 flex justify-center text-mint underline cursor-pointer" onClick={() => setShowNegotiation(!showNegotiation)}>
          {showNegotiation ? "접기" : "보기"}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequest.createdAt.toLocaleDateString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          -
        </div>
      </div>
      {showNegotiation
        && <BidRequestDetailsForInvoice
          bidRequestId={bidRequest.id} />}
    </>
  );
}
