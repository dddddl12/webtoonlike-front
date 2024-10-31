"use client";

import React, { useEffect, useRef, useState } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Heading, Text } from "@/ui/texts";
import { convertTimeAbsolute } from "@/utils/time";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { IconCross } from "@/components/svgs/IconCross";
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { WebtoonT } from "@/resources/webtoons/webtoon.types";
import { Paginator } from "@/ui/tools/Paginator";
import { listMyWebtoonsWithNoRounds } from "@/resources/webtoons/webtoon.service";

type WebtoonList = {
  items: WebtoonT[];
  totalPages: number;
}

export function CreatorOwnWebtoonList({ initialWebtoonList }: {
  initialWebtoonList: WebtoonList
}) {
  const t = useTranslations("manageContents");

  return (
    <Col className="text-white">
      <Heading className="font-bold text-[26pt]">
        {t("unregisteredSeries")}
      </Heading>
      <Gap y={10} />
      <CreatorOwnWebtoonListContents initialWebtoonList={initialWebtoonList} />
    </Col>
  );
}

function CreatorOwnWebtoonListContents({ initialWebtoonList }: {
  initialWebtoonList: WebtoonList
}) {
  const router = useRouter();
  const t = useTranslations("manageContents");
  const [page, setPage] = useState<number>(0);
  const [webtoonList, setWebtoonList] = useState<WebtoonList>(initialWebtoonList);
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      // Skip the effect during the initial render
      isInitialRender.current = false;
      return;
    }
    listMyWebtoonsWithNoRounds({ page }).then(setWebtoonList);
  }, [page]);

  if (!webtoonList) {
    return <Spinner />;
  }
  if (webtoonList.items.length === 0) {
    return <NoRoundsFound />;
  }

  return <>
    <div
      className="flex justify-end flex-row min-w-[120px] h-10 px-4 py-2 text-mint rounded-sm hover:bg-gray-darker cursor-pointer"
      onClick={() => {
        router.push("/webtoons/create");
      }}
    >
      <IconCross className="fill-mint" />
      {t("addSeries")}
    </div>
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

      {webtoonList.items?.map((webtoon) => (
        <TableRow key={webtoon.id} {...webtoon} />
      ))}
    </Col>

    <Paginator
      currentPage={page}
      totalPages={webtoonList.totalPages}
      onPageChange={setPage}
      pageWindowLen={2}
    />
  </>;
}

function TableRow(webtoon: WebtoonT) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("manageContents");
  const TbidRoundStatus = useTranslations("bidRoundStatus");

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
        <div
          className="text-mint underline cursor-pointer"
          onClick={() => {router.push(`/webtoons/${webtoon.id}`);}}
        >
          {locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title}
        </div>
      </div>

      <div className="w-[40%] p-2 flex justify-center">
        {convertTimeAbsolute(webtoon.createdAt)}
      </div>

      <div className="w-[20%] p-2 flex justify-center">
        {webtoon.bidRounds && webtoon.bidRounds?.length > 0
          ? webtoon.bidRounds[0].disapprovedAt ? (locale === "ko" ? "반려" : "Disapproved")
            : TbidRoundStatus(webtoon.bidRounds[0].status)
          : webtoon.episodes?.length && webtoon.episodes?.length >= 3 ? (
            <div
              className="text-mint underline cursor-pointer"
              onClick={() => {router.push(`/market/bid-rounds/${webtoon.id}/create`);}}
            >
              {locale === "ko" ? "판매 등록 하기" : "Register for sale"}
            </div>
          ) : (
            `${webtoon.episodes?.length} / 3 ${t("episodes")}`
          )}
      </div>
    </div>
  );
}


function NoRoundsFound() {
  const router = useRouter();
  const t = useTranslations("manageContents");

  return (
    <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
      <Text className="text-white">{t("registerWebtoon")}</Text>
      <div
        className="flex flex-row min-w-[120px] h-10 px-4 py-2 text-mint rounded-sm hover:bg-gray-darker cursor-pointer"
        onClick={() => {
          router.push("/webtoons/create");
        }}
      >
        <IconCross className="fill-mint" />
        {t("addSeries")}
      </div>
    </Row>
  );
}