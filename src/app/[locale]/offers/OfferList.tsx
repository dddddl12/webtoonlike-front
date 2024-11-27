"use client";

import { Col } from "@/components/ui/common";
import { useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import { ListResponse } from "@/resources/globalTypes";
import useListData from "@/hooks/listData";
import OfferListRow from "@/app/[locale]/offers/OfferListRow";
import NoItems from "@/components/ui/NoItems";
import { listAllOffers } from "@/resources/offers/controllers/offer.controller";
import { OfferWithBuyerAndWebtoonT } from "@/resources/offers/dtos/offer.dto";

type OfferListResponse = ListResponse<OfferWithBuyerAndWebtoonT>;

export default function OfferList({ initialOfferListResponse }: {
  initialOfferListResponse: OfferListResponse;
}) {
  const t = useTranslations("manageOffers");
  const { listResponse, filters, setFilters } = useListData(
    listAllOffers,
    { page: 1 },
    initialOfferListResponse
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

      {listResponse.items.map((offer) => (
        <OfferListRow key={offer.id} offer={offer} />
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
