"use client";

import PageLayout from "@/components/ui/PageLayout";
import { useCallback, useState } from "react";
import WebtoonDetails from "@/components/shared/WebtoonPageContents/WebtoonDetails";
import ActiveBidRound from "@/components/shared/WebtoonPageContents/ActiveBidRound";
import { WebtoonDetailsExtendedT } from "@/resources/webtoons/dtos/webtoonDetails.dto";
import OpenOfferFormContext from "@/components/shared/WebtoonPageContents/OpenOfferFormContext";
import OfferForm from "@/components/forms/offer/OfferForm";
import { HR } from "@/components/ui/common";

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

      <HR />

      <ActiveBidRound webtoon={webtoon}/>

      {offerForm && webtoon.activeBidRound?.id
        && <>
          <HR />
          <OfferForm bidRoundId={webtoon.activeBidRound?.id}/>
        </>}

    </PageLayout>
  );
}
