"use client";

import React, { useState, useMemo } from "react";
import { useListData } from "@/hooks/ListData";
import { Pagenator } from "@/ui/tools/Pagenator";
import { Col, Gap, Row } from "@/ui/layouts";
import { Heading, Text } from "@/ui/texts";
import { convertTimeAbsolute } from "@/utils/time";
import { buildImgUrl } from "@/utils/media";
import { convertBidRoundStatus, convertBidRoundStatusEn } from "@/utils/bidRoundStatusConverter";
import Image from "next/image";
import * as BidRoundsApi from "@/apis/bid_rounds";
import type { BidRoundT, ListBidRoundOptionT } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useRouter } from "@/i18n/routing";
import { getServerUserInfo } from "@/utils/auth/server";

export function BidRequestList() {
  const router = useRouter();
  const user = getServerUserInfo();
  const t = useTranslations("manageOffers");
  const locale = useLocale();

  const { data: bidRounds$, actions: bidRoundsAct } = useListData({
    listFn: async (listOpt) => {
      return await BidRoundsApi.list(listOpt);
    },
  });

  const { status: bidRoundStatus, data: bidRounds } = bidRounds$;

  const myBidRounds = useMemo(() => {
    return bidRounds?.
      filter((bidRound) => bidRound.userId === user.id).
      filter((bidRound) => bidRound.status === "idle" || bidRound.status === "waiting");
  }, [bidRounds]);

  const [page, setPage] = useState<number>(0);

  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = myBidRounds.length || 0;

  const bidRoundListOpt: ListBidRoundOptionT = {
    meId: user.id,
    $webtoon: true,
    $user: true,
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
  };

  bidRoundsAct.load(bidRoundListOpt);

  if (bidRoundStatus == "idle" || bidRoundStatus == "loading") {
    return <Spinner />;
  }
  if (bidRoundStatus == "error") {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
    return (
      <div className="flex p-2 text-white">
        <div className="w-[40%] p-2 flex justify-start font-bold">{t("seriesName")}</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">{t("biddingStartAt")}</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">{t("offerStartAt")}</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">{t("status")}</div>
      </div>
    );
  }

  function TableRow(bidRound: BidRoundT) {
    return (
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[40%] p-2 flex justify-start items-center">
          <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
            <Image
              src={bidRound.webtoon?.thumbPath ? buildImgUrl(null, bidRound.webtoon?.thumbPath, { size: "xs" }) : "/img/webtoon_default_image_small.svg"}
              alt={`${bidRound.webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={4} />
          <div
            className="text-mint underline cursor-pointer"
            onClick={() => {router.push(`/webtoons/${bidRound.webtoon?.id}`);}}>
            {locale === "ko" ? bidRound.webtoon?.title : bidRound.webtoon?.title_en ?? bidRound.webtoon?.title}
          </div>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRound.bidStartAt ? convertTimeAbsolute(bidRound.bidStartAt) : "-"}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRound.negoStartAt ? convertTimeAbsolute(bidRound.negoStartAt) : "-"}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {locale === "ko" ? convertBidRoundStatus(bidRound.status) : convertBidRoundStatusEn(bidRound.status)}
        </div>
      </div>
    );
  }

  function WebtoonTable(bidRounds: BidRoundT[]) {
    return (
      <Col>
        <TableHeader />
        {bidRounds.map((webtoon) => (
          <TableRow key={webtoon.id} {...webtoon} />
        ))}
      </Col>
    );
  }

  return (
    <Col className="text-white">
      <Heading className="font-bold text-[26pt]">{t("pendingSeries")}</Heading>
      <Gap y={10} />

      {myBidRounds.length === 0
        ? <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
          <Text className="text-white">{t("noPendingContract")}</Text>
        </Row>
        : <>
          {WebtoonTable(myBidRounds)}
          <Pagenator
            page={page}
            numData={totalNumData}
            itemsPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
      }
    </Col>
  );
}