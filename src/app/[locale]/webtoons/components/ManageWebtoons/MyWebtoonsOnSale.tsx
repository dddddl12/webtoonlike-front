"use client";

import { Col } from "@/components/ui/common";
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

export default function MyWebtoonsOnSale({ initialWebtoonListResponse }: {
  initialWebtoonListResponse: ListResponse<MyWebtoonOnSaleT>;
}) {
  const t = useTranslations("manageContents");
  const { listResponse, filters, setFilters } = useListData(
    listMyWebtoonsOnSale, { page: 1 }, initialWebtoonListResponse);

  if (listResponse.items.length === 0) {
    return <NoItems message={t("noSeriesBeingSold")} />;
  }

  return (<>
    <Col>
      <TableHeader />
      {listResponse.items?.map((webtoon) => (
        <TableRow key={webtoon.id} webtoon={webtoon} />
      ))}
    </Col>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
      pageWindowLen={2}
    />
  </>
  );
}


function TableHeader() {
  const t = useTranslations("manageContents");
  return (
    <div className="flex p-2 text-white">
      <div className="w-[40%] p-2 flex justify-start font-bold">
        {t("seriesName")}
      </div>
      <div className="w-[40%] p-2 flex justify-center font-bold">
        {t("registrationDate")}
      </div>
      <div className="w-[20%] p-2 flex justify-center font-bold">
        {t("status")}
      </div>
    </div>
  );
}

function TableRow({ webtoon }: {
  webtoon: MyWebtoonOnSaleT;
}) {
  const locale = useLocale();
  return (
    <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
      <div className="w-[40%] p-2 flex justify-start items-center">
        <WebtoonAvatar webtoon={webtoon}/>
      </div>

      <div className="w-[40%] p-2 flex justify-center">
        {webtoon.bidRoundApprovedAt?.toLocaleString(locale)}
      </div>

      <div className="w-[20%] p-2 flex justify-center">
        <BidRoundStatusBadge status={webtoon.bidRoundStatus} />
      </div>
    </div>
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
