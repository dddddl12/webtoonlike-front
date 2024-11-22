"use client";

import PageLayout from "@/components/PageLayout";
import BidRequestForm from "@/components/forms/BidRequestForm";
import { useState } from "react";
import WebtoonDetails from "@/app/[locale]/webtoons/components/WebtoonPageContents/WebtoonDetails";
import { WebtoonDetailsT } from "@/resources/webtoons/webtoon.controller";
import ActiveBidRound from "@/app/[locale]/webtoons/components/WebtoonPageContents/ActiveBidRound";

export default function WebtoonPageContents({ webtoon }: {
  webtoon: WebtoonDetailsT;
}) {
  const [openBidRequestForm, setOpenBidRequestForm] = useState(false);
  return (
    <PageLayout>
      <WebtoonDetails
        webtoon={webtoon}
        openBidRequestForm={openBidRequestForm}
        setOpenBidRequestForm={setOpenBidRequestForm}
      />

      <hr className="border-gray-shade my-10"/>

      <ActiveBidRound webtoon={webtoon}/>

      {openBidRequestForm
        && <>
          <hr className="border-gray-shade my-10"/>

          <BidRequestFormContainer bidRoundId={webtoon.activeBidRound?.id} />

        </>}

    </PageLayout>
  );
}

function BidRequestFormContainer({ bidRoundId }: {
  bidRoundId?: number;
}) {
  if (bidRoundId) {
    return <BidRequestForm bidRoundId={bidRoundId}/>;
  } else {
    return <div>오퍼가 가능한 작품이 아닙니다.</div>;
  }
}