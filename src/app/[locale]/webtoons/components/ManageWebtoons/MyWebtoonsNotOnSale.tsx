"use client";

import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { IconCross } from "@/components/svgs/IconCross";
import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/Paginator";
import { listMyWebtoonsNotOnSale } from "@/resources/webtoons/webtoon.service";
import { Link } from "@/i18n/routing";
import { useListData } from "@/hooks/listData";
import { displayName } from "@/utils/displayName";
import { BidRoundApprovalStatus, BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import StatusBadge from "@/components/StatusBadge";

type WebtoonListResponse = Awaited<ReturnType<typeof listMyWebtoonsNotOnSale>>;
type Webtoon = WebtoonListResponse["items"][number];

export default function MyWebtoonsNotOnSale({ initialWebtoonListResponse }: {
  initialWebtoonListResponse: WebtoonListResponse;
}) {
  const t = useTranslations("manageContents");
  const { listResponse, filters, setFilters } = useListData(
    listMyWebtoonsNotOnSale, { page: 1 }, initialWebtoonListResponse);

  if (listResponse.items.length === 0) {
    return <NoItemsFound />;
  }

  return <>
    <Row className="justify-end">
      <Link
        className="flex justify-end flex-row min-w-[120px] h-10 px-4 py-2 text-mint rounded-sm hover:bg-gray-darker cursor-pointer"
        href="/webtoons/create"
      >
        <IconCross className="fill-mint" />
        {t("addSeries")}
      </Link>
    </Row>
    <Col>
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
  </>;
}

function TableRow({ webtoon }: {
  webtoon: Webtoon;
}) {
  const locale = useLocale();

  return (
    <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
      <div className="w-[40%] p-2 flex justify-start items-center">
        <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
          <Image
            src={buildImgUrl(webtoon.thumbPath, { size: "xs" } )}
            alt={`${webtoon.thumbPath}`}
            style={{ objectFit: "cover" }}
            fill
          />
        </div>
        <Gap x={4} />
        <Link
          className="text-mint underline"
          href={`/webtoons/${webtoon.id}`}
        >
          {displayName(locale, webtoon.title, webtoon.title_en)}
        </Link>
      </div>

      <div className="w-[40%] p-2 flex justify-center">
        {webtoon.createdAt.toLocaleString(locale)}
      </div>

      <div className="w-[20%] p-2 flex justify-center">
        <StatusIndicator webtoon={webtoon} />
      </div>
    </div>
  );
}

function StatusIndicator({ webtoon }: {
  webtoon: Webtoon;
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
      className="text-mint underline"
      href={`/webtoons/${webtoon.id}/bid-round/create`}
    >
      {t("registerForSale")}
    </Link>;
  }
}

function NoItemsFound() {
  const t = useTranslations("manageContents");

  return (
    <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
      <Text className="text-white">{t("registerWebtoon")}</Text>
      <Link
        className="flex flex-row min-w-[120px] h-10 px-4 py-2 text-mint rounded-sm hover:bg-gray-darker cursor-pointer"
        href={"/webtoons/create"}
      >
        <IconCross className="fill-mint" />
        {t("addSeries")}
      </Link>
    </Row>
  );
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
