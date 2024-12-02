"use client";

import { Row } from "@/components/ui/common";
import { IconCross } from "@/components/svgs/IconCross";
import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import { Link } from "@/i18n/routing";
import useListData from "@/hooks/listData";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import StatusBadge from "@/components/ui/StatusBadge";
import { ListResponse } from "@/resources/globalTypes";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { MyWebtoonNotOnSaleT } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { listMyWebtoonsNotOnSale } from "@/resources/webtoons/controllers/webtoonPreview.controller";
import NoItems from "@/components/ui/NoItems";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";

export default function MyWebtoonsNotOnSale({ initialWebtoonListResponse }: {
  initialWebtoonListResponse: ListResponse<MyWebtoonNotOnSaleT>;
}) {
  const t = useTranslations("manageContents");
  const { listResponse, filters, setFilters } = useListData(
    listMyWebtoonsNotOnSale, { page: 1 }, initialWebtoonListResponse);

  if (listResponse.items.length === 0) {
    return <NoItems message={t("registerWebtoon")}>
      <Link
        className="flex clickable ml-4"
        href={"/webtoons/create"}
      >
        <IconCross/>
        {t("addSeries")}
      </Link>
    </NoItems>;
  }

  return <>
    <Row className="justify-end">
      {/*todo*/}
      <Link
        className="flex clickable"
        href="/webtoons/create"
      >
        <IconCross/>
        {t("addSeries")}
      </Link>
    </Row>
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
  webtoon: MyWebtoonNotOnSaleT;
}) {
  const locale = useLocale();

  return (
    <ListRow>
      <ListCell>
        <WebtoonAvatar webtoon={webtoon}/>
      </ListCell>

      <ListCell>
        {webtoon.createdAt.toLocaleString(locale)}
      </ListCell>

      <ListCell>
        <StatusIndicator webtoon={webtoon} />
      </ListCell>
    </ListRow>
  );
}

function StatusIndicator({ webtoon }: {
  webtoon: MyWebtoonNotOnSaleT;
}) {
  const t = useTranslations("manageContents");
  const { bidRoundApprovalStatus } = webtoon;

  if (bidRoundApprovalStatus) {
    return <BidRoundApprovalStatusBadge status={bidRoundApprovalStatus} />;
  } else if (webtoon.episodeCount < 3) {
    const content = t("episodes", {
      count: webtoon.episodeCount
    });
    return <StatusBadge variant="grayDark" content={content}/>;
  } else {
    return <Link
      className="clickable"
      href={`/webtoons/${webtoon.id}/bid-round/update`}
    >
      {t("registerForSale")}
    </Link>;
  }
}

function BidRoundApprovalStatusBadge({ status }:{
  status: BidRoundApprovalStatus;
}) {
  const tBidRoundApprovalStatus = useTranslations("bidRoundApprovalStatus");
  const content = tBidRoundApprovalStatus(status);
  switch (status) {
    case BidRoundApprovalStatus.Pending:
      return <StatusBadge variant="yellow" content={content} />;
    case BidRoundApprovalStatus.Disapproved:
      return <StatusBadge variant="red" content={content} />;
    default:
      return <StatusBadge content={content} />;
  }
}
