"use client";

import PageLayout from "@/components/ui/PageLayout";
import BidRequestForm from "@/components/forms/BidRequestForm";
import { useCallback, useState } from "react";
import WebtoonDetails from "@/components/shared/WebtoonPageContents/WebtoonDetails";
import ActiveBidRound from "@/components/shared/WebtoonPageContents/ActiveBidRound";
import { WebtoonDetailsExtendedT } from "@/resources/webtoons/dtos/webtoonDetails.dto";
import OpenOfferFormContext from "@/components/shared/WebtoonPageContents/OpenOfferFormContext";

export default function WebtoonPageContents({ webtoon }: {
  webtoon: WebtoonDetailsExtendedT;
}) {
  const [offerForm, setOfferForm] = useState(false);
  const openOfferForm = useCallback(() => {
    setOfferForm(true);
  }, []);
  return (
    <PageLayout>
      <OpenOfferFormContext.Provider value={openOfferForm}>
        <WebtoonDetails
          webtoon={webtoon}
          context="WebtoonView"
        />
      </OpenOfferFormContext.Provider>

      <hr className="border-gray-shade my-10"/>

      <ActiveBidRound webtoon={webtoon}/>

      {offerForm
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