"use client";

import Raact, { useState } from "react";
import { Col, Row, Container, Gap } from "@/ui/layouts";
import { Heading } from "@/ui/texts";
import { BidRoundList } from "./BidRoundList";
import { BidRoundDetail } from "./BidRoundDetail";
import { BidRoundIdleList } from "./BidRoundIdleList";
import { Button } from "@/ui/shadcn/Button";
import type { BidRoundT } from "@backend/types/BidRound";


export function ManageBidRoundTab() {
  const [roundDetail, setRoundDetail] = useState<null | BidRoundT>(null);

  function handleDetailClick(bidRound: BidRoundT): void {
    setRoundDetail(bidRound);
  }
  function handleDetailReset(): void {
    setRoundDetail(null);
  }

  return (
    <Container className="p-0">
      <Row className="items-start">
        {roundDetail !== null && (
          <Button onClick={handleDetailReset}>
            back
          </Button>
        )}
      </Row >
      {roundDetail !== null ? (
        <BidRoundDetail bidRound={roundDetail} onHandleDetailReset={handleDetailReset} />
      ) : (
        <>
          <BidRoundIdleList onDetailClick={handleDetailClick} />
          <BidRoundList onDetailClick={handleDetailClick} />
        </>
      )
      }
      <Gap y={40} />
    </Container>
  );
}
