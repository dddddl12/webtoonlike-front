"use client";

import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { IconCross } from "@/components/svgs/IconCross";
import { useLocale, useTranslations } from "next-intl";
import { WebtoonT } from "@/resources/webtoons/webtoon.types";
import { Paginator } from "@/ui/tools/Paginator";
import { listMyWebtoonsNotOnSale } from "@/resources/webtoons/webtoon.service";
import { Link } from "@/i18n/routing";
import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { displayName } from "@/utils/displayName";

type WebtoonListResponse = ListResponse<WebtoonT>

export default function BidRoundListNotOnSale({ initialWebtoonListResponse }: {
  initialWebtoonListResponse: WebtoonListResponse
}) {
  const t = useTranslations("manageContents");
  const { listResponse, filters, setFilters } = useListData(
    listMyWebtoonsNotOnSale, { page: 1 }, initialWebtoonListResponse);

  if (listResponse.items.length === 0) {
    return <NoItemsFound />;
  }

  return <>
    <Link
      className="flex justify-end flex-row min-w-[120px] h-10 px-4 py-2 text-mint rounded-sm hover:bg-gray-darker cursor-pointer"
      href="/webtoons/create"
    >
      <IconCross className="fill-mint" />
      {t("addSeries")}
    </Link>
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
  webtoon: WebtoonT
}) {
  const locale = useLocale();

  return (
    <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
      <div className="w-[40%] p-2 flex justify-start items-center">
        <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
          <Image
            src={webtoon.thumbPath ? buildImgUrl(null, webtoon.thumbPath, { size: "xs" } ) : "/img/webtoon_default_image_small.svg"}
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
        상태
        {/*TODO*/}
        {/*{webtoon.bidRounds && webtoon.bidRounds?.length > 0*/}
        {/*  ? webtoon.bidRounds[0].disapprovedAt ? (locale === "ko" ? "반려" : "Disapproved")*/}
        {/*    : TbidRoundStatus(webtoon.bidRounds[0].status)*/}
        {/*  : webtoon.episodes?.length && webtoon.episodes?.length >= 3 ? (*/}
        {/*    <div*/}
        {/*      className="text-mint underline cursor-pointer"*/}
        {/*      onClick={() => {router.push(`/market/bid-rounds/${webtoon.id}/create`);}}*/}
        {/*    >*/}
        {/*      {locale === "ko" ? "판매 등록 하기" : "Register for sale"}*/}
        {/*    </div>*/}
        {/*  ) : (*/}
        {/*    `${webtoon.episodes?.length} / 3 ${t("episodes")}`*/}
        {/*  )}*/}
      </div>
    </div>
  );
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