"use client";

import React, { useEffect, useState } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Heading, Text } from "@/ui/texts";
import { convertTimeAbsolute } from "@/utils/time";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useRouter } from "next/navigation";
import { BidRoundT } from "@/resources/bidRounds/bidRound.types";

export function BidRoundList({
  bidRounds
}: {
  bidRounds: BidRoundT[]
}) {
  const router = useRouter();
  const t = useTranslations("manageContents");
  const locale = useLocale();

  const [page, setPage] = useState<number>(0);

  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = bidRounds$.numData || 0;

  // const listOpt: ListBidRoundOptionT = {
  //   $webtoon: true,
  //   userId: me?.id,
  //   status: "waiting, bidding, negotiating, done",
  //   $numData: true,
  //   offset: page * itemPerPage,
  //   limit: itemPerPage,
  // };

  useEffect(() => {
    if (!me) return;
    bidRoundsAct.load(listOpt);
  }, [me, page]);

  const { status, data: bidRounds } = bidRounds$;

  if (status == "idle" || status == "loading") {
    return <Spinner />;
  }
  if (status == "error") {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  const filteredBidRounds = bidRounds;

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

  function TableRow(bidRound: BidRoundT) {
    return (
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[40%] p-2 flex justify-start items-center">
          <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
            <Image
              src={
                bidRound.webtoon?.thumbPath
                  ? buildImgUrl(null, bidRound.webtoon.thumbPath, {
                    size: "sm",
                  })
                  : "/img/webtoon_default_image_small.svg"
              }
              alt={`${bidRound.webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={4} />
          <div
            className="text-mint underline cursor-pointer"
            onClick={() => {
              router.push(`/webtoons/${bidRound.webtoon?.id}`);
            }}
          >
            {locale === "ko"
              ? bidRound.webtoon?.title
              : bidRound.webtoon?.title_en ?? bidRound.webtoon?.title}
          </div>
        </div>

        <div className="w-[40%] p-2 flex justify-center">
          {convertTimeAbsolute(bidRound.createdAt)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {locale === "ko" ? convertBidRoundStatus(bidRound.status)
            : convertBidRoundStatusEn(bidRound.status)}
        </div>
      </div>
    );
  }

  function WebtoonTable(bidRounds: BidRoundT[]) {
    return (
      <Col>
        <TableHeader />
        {bidRounds.map((bidRound) => (
          <TableRow key={bidRound.id} {...bidRound} />
        ))}
      </Col>
    );
  }

  return (
    <Col className="text-white">
      <Heading className="font-bold text-[26pt]">
        {t("registeredSeries")}
      </Heading>
      <Gap y={10} />

      {filteredBidRounds.length === 0 ? (
        <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
          <Text className="text-white">
            {t("noSeriesBeingSold")}
          </Text>
        </Row>
      ) : (
        <>
          {WebtoonTable(bidRounds)}
          <Gap y={4} />
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
