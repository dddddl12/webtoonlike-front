import React from "react";
import { Gap } from "@/ui/layouts";
import { CreatorOwnWebtoonList } from "@/app/[locale]/creator/bid-rounds/CreatorOwnWebtoonList";
// import { BidRoundList } from "@/app/[locale]/creator/bid-rounds/BidRoundList";
import { listBidRounds } from "@/resources/bidRounds/bidRound.service";
import { listMyWebtoonsWithNoRounds } from "@/resources/webtoons/webtoon.service";
import PageLayout from "@/components/PageLayout";

export default async function BidRound() {
  const [
    initialWebtoonListNotOnSale,
    initialBidRoundList
  ] = await Promise.all([
    listMyWebtoonsWithNoRounds(),
    listBidRounds()
  ]);
  return (
    <PageLayout>
      <CreatorOwnWebtoonList initialWebtoonList={initialWebtoonListNotOnSale} />
      <Gap y={20} />
      {/*<BidRoundList initialBidRoundList={initialBidRoundList} />*/}
    </PageLayout>
  );
}