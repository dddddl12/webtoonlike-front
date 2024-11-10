"use client";

import { useState } from "react";
import { AdminPageBidRoundT } from "@/resources/bidRounds/bidRound.service";
import BidRoundDetail from "@/app/[locale]/admin/webtoons/BidRoundDetail";
import BidRoundPendingList from "@/app/[locale]/admin/webtoons/BidRoundPendingList";
import BidRoundList from "@/app/[locale]/admin/webtoons/BidRoundList";
import { Col, Row } from "@/shadcn/ui/layouts";


export default function ManageBidRoundPage() {
  const [roundDetail, setRoundDetail] = useState<AdminPageBidRoundT>();

  function handleDetailClick(bidRound: AdminPageBidRoundT): void {
    setRoundDetail(bidRound);
  }
  function handleDetailReset(): void {
    setRoundDetail(undefined);
  }

  if (roundDetail) {
    return <BidRoundDetail bidRound={roundDetail} onHandleDetailReset={handleDetailReset} />;
  }

  return (
    <Col className="gap-10">
      <Col>
        <p className="font-bold text-[18pt]">작품 승인</p>
        <BidRoundPendingList onDetailClick={handleDetailClick} />
      </Col>
      <Col>
        <p className="font-bold text-[18pt]">작품 관리</p>
        <BidRoundList />
      </Col>

    </Col>
  );
}
