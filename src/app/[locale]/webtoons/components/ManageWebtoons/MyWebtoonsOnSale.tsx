"use client";

import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/Paginator";
import { useListData } from "@/hooks/listData";
import { listMyWebtoonsOnSale } from "@/resources/webtoons/webtoon.service";
import { Link } from "@/i18n/routing";
import { displayName } from "@/utils/displayName";
import { BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import StatusBadge from "@/components/StatusBadge";

type WebtoonListResponse = Awaited<ReturnType<typeof listMyWebtoonsOnSale>>;
type Webtoon = WebtoonListResponse["items"][number];

export default function MyWebtoonsOnSale({ initialWebtoonListResponse }: {
  initialWebtoonListResponse: WebtoonListResponse;
}) {
  const { listResponse, filters, setFilters } = useListData(
    listMyWebtoonsOnSale, { page: 1 }, initialWebtoonListResponse);

  if (listResponse.items.length === 0) {
    return <NoItemsFound />;
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
  webtoon: Webtoon;
}) {
  const locale = useLocale();
  return (
    <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
      <div className="w-[40%] p-2 flex justify-start items-center">
        <Image
          src={
            buildImgUrl(webtoon.thumbPath, {
              size: "sm",
            })
          }
          alt={webtoon.thumbPath}
          style={{ objectFit: "cover" }}
          width={60}
          height={60}
          className="rounded-sm"
        />
        <Gap x={4} />
        <Link
          className="text-mint underline cursor-pointer"
          href={`/webtoons/${webtoon.id}`}
        >
          {displayName(locale, webtoon.title, webtoon.title_en)}
        </Link>
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

function NoItemsFound() {
  const t = useTranslations("manageContents");
  return <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
    <Text className="text-white">
      {t("noSeriesBeingSold")}
    </Text>
  </Row>;
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
