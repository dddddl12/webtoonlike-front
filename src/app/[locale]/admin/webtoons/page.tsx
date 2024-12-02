"use client";

import { useCallback, useState } from "react";
import BidRoundDetail from "@/app/[locale]/admin/webtoons/BidRoundDetail";
import BidRoundPendingList from "@/app/[locale]/admin/webtoons/BidRoundPendingList";
import BidRoundList from "@/app/[locale]/admin/webtoons/BidRoundList";
import { Heading2 } from "@/components/ui/common";
import { AdminPageBidRoundT } from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";


export default function ManageBidRoundPage() {
  const [roundDetail, setRoundDetail] = useState<AdminPageBidRoundT>();

  const handleDetailClick = useCallback((bidRound: AdminPageBidRoundT) => {
    setRoundDetail(bidRound);
  }, []);
  const handleDetailReset = useCallback(() => {
    setRoundDetail(undefined);
  }, []);

  if (roundDetail) {
    return <BidRoundDetail bidRound={roundDetail} onHandleDetailReset={handleDetailReset} />;
  }

  return (
    <>
      <Heading2>작품 승인</Heading2>
      <BidRoundPendingList onDetailClick={handleDetailClick} />
      <Heading2>작품 관리</Heading2>
      <BidRoundList />
    </>
  );
}
