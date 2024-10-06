"use client";

import React, { useEffect, useState } from "react";
import { useListData } from "@/hooks/ListData";
import * as WebtoonApi from "@/apis/webtoons";
import { Pagenator } from "@/ui/tools/Pagenator";
import { useMe } from "@/states/UserState";
import { Col, Gap, Row } from "@/ui/layouts";
import { Heading, Text } from "@/ui/texts";
import { convertTimeAbsolute } from "@/utils/time";
import { buildImgUrl } from "@/utils/media";
import { convertBidRoundStatus, convertBidRoundStatusEn } from "@/utils/bidRoundStatusConverter";
import Image from "next/image";
import { IconCross } from "@/components/svgs/IconCross";
import type { ListWebtoonOptionT, WebtoonT } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useRouter } from "@/i18n/routing";

export function CreatorOwnWebtoonList() {
  const router = useRouter();
  const me = useMe();
  const t = useTranslations("manageContents");
  const locale = useLocale();

  const { data: webtoons$, actions: webtoonsAct } = useListData({
    listFn: async (listOpt) => {
      return await WebtoonApi.list(listOpt);
    },
  });

  const [page, setPage] = useState<number>(0);

  const { status: webtoonStatus, data: webtoons } = webtoons$;

  const filteredWebtoons = webtoons.filter((webtoon) => {
    return (
      (webtoon.bidRounds && webtoon.bidRounds?.length === 0) ||
      (webtoon.bidRounds && webtoon.bidRounds?.[0]?.status === "idle")
    );
  });

  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = filteredWebtoons.length || 0;

  const webtoonListOpt: ListWebtoonOptionT = {
    meId: me?.id,
    $bidRounds: true,
    mine: "only",
    $episodes: true,
  };

  useEffect(() => {
    if (!me) return;
    webtoonsAct.load(webtoonListOpt);
  }, [me, page]);

  if (webtoonStatus == "idle" || webtoonStatus == "loading") {
    return <Spinner />;
  }
  if (webtoonStatus == "error") {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
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

  function TableRow(webtoon: WebtoonT) {
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
            : (locale === "ko" ? convertBidRoundStatus(webtoon.bidRounds[0].status) : convertBidRoundStatusEn(webtoon.bidRounds[0].status))
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

  function WebtoonTable() {
    const startIndex = page * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    const paginatedWebtoons = filteredWebtoons?.slice(startIndex, endIndex);
    return (
      <Col>
        <TableHeader />
        {paginatedWebtoons?.map((webtoon) => (
          <TableRow key={webtoon.id} {...webtoon} />
        ))}
      </Col>
    );
  }

  return (
    <Col className="text-white">
      <Heading className="font-bold text-[26pt]">
        {t("unregisteredSeries")}
      </Heading>
      <Gap y={10} />

      {filteredWebtoons.length === 0 ? (
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
      ) : (
        <>
          {me?.userType === "creator" ? (
            <div
              className="flex justify-end flex-row min-w-[120px] h-10 px-4 py-2 text-mint rounded-sm hover:bg-gray-darker cursor-pointer"
              onClick={() => {
                router.push("/webtoons/create");
              }}
            >
              <IconCross className="fill-mint" />
              {t("addSeries")}
            </div>
          ) : null}
          <WebtoonTable />
          <Pagenator
            page={page}
            numData={totalNumData}
            itemPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
      )}
    </Col>
  );
}
