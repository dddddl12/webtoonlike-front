"use client";

import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import { BidRoundStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import StatusBadge from "@/components/ui/StatusBadge";
import { ListResponse } from "@/resources/globalTypes";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { MyWebtoonOnSaleT } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { listMyWebtoonsOnSale } from "@/resources/webtoons/controllers/webtoonPreview.controller";
import NoItems from "@/components/ui/NoItems";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";

export default function MyWebtoonsOnSale({ initialWebtoonListResponse }: {
  initialWebtoonListResponse: ListResponse<MyWebtoonOnSaleT>;
}) {
  const t = useTranslations("manageContents");
  const { listResponse, filters, setFilters } = useListData(
    listMyWebtoonsOnSale, { page: 1 }, initialWebtoonListResponse);

  if (listResponse.items.length === 0) {
    return <NoItems message={t("noSeriesBeingSold")} />;
  }

  return <>
    <ListTable columns={[
      {
        label: t("seriesName"),
        width: 2
      },
      {
        label: t("registrationDate"),
        width: 2
      },
      {
        label: t("status"),
        width: 1
      }
    ]}>
      {listResponse.items?.map((webtoon) => (
        <TableRow key={webtoon.id} webtoon={webtoon} />
      ))}
    </ListTable>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
      pageWindowLen={2}
    />
  </>;
}

function TableRow({ webtoon }: {
  webtoon: MyWebtoonOnSaleT;
}) {
  const locale = useLocale();
  return (
    <ListRow>
      <ListCell>
        <WebtoonAvatar webtoon={webtoon}/>
      </ListCell>

      <ListCell>
        {webtoon.bidRoundApprovedAt?.toLocaleString(locale)}
      </ListCell>

      <ListCell>
        <BidRoundStatusBadge status={webtoon.bidRoundStatus} />
      </ListCell>
    </ListRow>
  );
}

function BidRoundStatusBadge({ status }:{
  status: BidRoundStatus;
}) {
  const TbidRoundStatus = useTranslations("bidRoundStatus");
  const content = TbidRoundStatus(status);
  switch (status) {
    case BidRoundStatus.PendingApproval:
      return <StatusBadge variant="yellow" content={content} />;
    case BidRoundStatus.Disapproved:
      return <StatusBadge variant="red" content={content} />;
    case BidRoundStatus.Waiting:
      return <StatusBadge variant="grayDark" content={content} />;
    case BidRoundStatus.Bidding:
      return <StatusBadge variant="yellow" content={content} />;
    case BidRoundStatus.Negotiating:
      return <StatusBadge variant="mint" content={content} />;
    case BidRoundStatus.Done:
      return <StatusBadge variant="mint" content={content} />;
    default:
      return <StatusBadge content={content} />;
  }
}
