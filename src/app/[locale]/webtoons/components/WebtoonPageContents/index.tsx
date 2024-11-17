"use client";

import ContractRange from "@/app/[locale]/webtoons/components/WebtoonPageContents/ContractRange";
import PageLayout from "@/components/PageLayout";
import BidRequestForm from "@/app/[locale]/webtoons/components/forms/BidRequestForm";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/shadcn/ui/button";
import WebtoonDetails from "@/app/[locale]/webtoons/components/WebtoonPageContents/WebtoonDetails";
import { WebtoonDetailsT } from "@/resources/webtoons/webtoon.service";

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

      <ContractRange webtoon={webtoon}/>
      {webtoon.isEditable && <Button asChild>
        <Link href={`/webtoons/${webtoon.id}/episodes/create`}>
          에피소드 추가
        </Link>
      </Button>}

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