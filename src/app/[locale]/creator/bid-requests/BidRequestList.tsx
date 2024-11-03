"use client";

import { Col, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { useTranslations } from "next-intl";
import Spinner from "@/components/Spinner";
import { BidRequestExtendedT } from "@/resources/bidRequests/bidRequest.types";
import { listBidRequests } from "@/resources/bidRequests/bidRequest.service";
import { Paginator } from "@/ui/tools/Paginator";
import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { BidRequestRow } from "@/app/[locale]/creator/bid-requests/BidRequestRow";

type BidRequestListResponse = ListResponse<BidRequestExtendedT>;

export default function BidRequestList({ initialBidRequestListResponse }: {
  initialBidRequestListResponse: BidRequestListResponse
}) {
  const t = useTranslations("manageOffers");
  const { listResponse, filters, setFilters } = useListData(
    listBidRequests,
    { page: 1 },
    initialBidRequestListResponse
  );

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
      <Text className="text-white">오퍼가 없습니다.</Text>
    </Row>;
  }

  return <>
    <Col>
      <div className="flex p-2 text-white">
        <div className="w-[40%] p-2 flex justify-start font-bold">{t("seriesName")}</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">오퍼 제출 날짜</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">협상 내역 보기</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">{t("status")}</div>
      </div>

      {listResponse.items.map((bidRequest) => (
        <BidRequestRow key={bidRequest.id} bidRequest={bidRequest} />
      ))}
    </Col>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}
