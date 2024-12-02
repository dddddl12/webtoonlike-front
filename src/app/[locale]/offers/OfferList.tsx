"use client";

import { useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import { ListResponse } from "@/resources/globalTypes";
import useListData from "@/hooks/listData";
import OfferListRow from "@/app/[locale]/offers/OfferListRow";
import NoItems from "@/components/ui/NoItems";
import { listAllOffers } from "@/resources/offers/controllers/offer.controller";
import { OfferWithBuyerAndWebtoonT } from "@/resources/offers/dtos/offer.dto";
import { ListTable } from "@/components/ui/ListTable";

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
    <ListTable columns={[
      {
        label: t("seriesName"),
        width: 2,
      },
      {
        label: t("offerSubmittedAt"),
        width: 2,
      },
      {
        label: t("negotiation"),
        width: 1,
      },
      {
        label: t("status"),
        width: 1,
      }
    ]}>
      {listResponse.items.map((offer) => (
        <OfferListRow key={offer.id} offer={offer} />
      ))}
    </ListTable>
    {/*TODO window 통일*/}
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}
