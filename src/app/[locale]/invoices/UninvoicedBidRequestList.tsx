"use client";

import { Col } from "@/components/ui/common";
import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import { ListResponse } from "@/resources/globalTypes";
import { useState } from "react";
import BidRequestDetailsForInvoice from "@/app/[locale]/invoices/BidRequestDetailsForInvoice";
import { BidRequestWithMetaDataT } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";
import { listUninvoicedBidRequests } from "@/resources/bidRequests/controllers/bidRequestWithMetadata.controller";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";

export function UninvoicedBidRequestList({ initialBidRequestListResponse }: {
  initialBidRequestListResponse: ListResponse<BidRequestWithMetaDataT>;
}) {
  const t = useTranslations("invoiceManagement");
  const { listResponse, filters, setFilters } = useListData(
    listUninvoicedBidRequests,
    { page: 1 },
    initialBidRequestListResponse
  );

  if (listResponse.items.length === 0) {
    return <NoItems message="인보이스 발행 대기 중인 오퍼가 없습니다."/>;
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

function TableRow({ bidRequest }: { bidRequest: BidRequestWithMetaDataT }) {
  const locale = useLocale();
  const [showNegotiation, setShowNegotiation] = useState(false);
  const t = useTranslations("invoiceManagement");

  return (
    <>
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[20%] p-2 flex justify-start items-center">
          <WebtoonAvatar webtoon={bidRequest.webtoon}/>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequest.creator.user.name}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequest.buyer.user.name}
        </div>

        <div className="w-[20%] p-2 flex justify-center clickable" onClick={() => setShowNegotiation(!showNegotiation)}>
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
