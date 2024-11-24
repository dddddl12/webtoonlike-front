"use client";

import { Col } from "@/components/ui/common";
import { useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import { ListResponse } from "@/resources/globalTypes";
import useListData from "@/hooks/listData";
import BidRequestListRow from "@/app/[locale]/offers/BidRequestListRow";
import { BidRequestWithMetaDataT } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";
import { listAllBidRequests } from "@/resources/bidRequests/controllers/bidRequestWithMetadata.controller";
import NoItems from "@/components/ui/NoItems";

type BidRequestListResponse = ListResponse<BidRequestWithMetaDataT>;

export default function BidRequestList({ initialBidRequestListResponse }: {
  initialBidRequestListResponse: BidRequestListResponse;
}) {
  const t = useTranslations("manageOffers");
  const { listResponse, filters, setFilters } = useListData(
    listAllBidRequests,
    { page: 1 },
    initialBidRequestListResponse
  );

  if (listResponse.items.length === 0) {
    return <NoItems message="오퍼가 없습니다."/>;
  }

  return <>
    <Col>
      <div className="flex p-2">
        <div className="w-[40%] p-2 flex justify-start font-bold">{t("seriesName")}</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">오퍼 제출 날짜</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">협상 내역 보기</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">{t("status")}</div>
      </div>

      {listResponse.items.map((bidRequest) => (
        <BidRequestListRow key={bidRequest.id} bidRequest={bidRequest} />
      ))}
    </Col>
    {/*TODO window 통일*/}
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}
