import React from "react";
import { Container, Gap } from "@/ui/layouts";
import { BidRequestList } from "./BidRequestList";
import { OfferList } from "./OfferList";

export function CreatorBidRequestListPage() {
  return (
    <Container className="bg-[#121212]">
      <Gap y={20} />
      <BidRequestList />
      <Gap y={20} />
      <OfferList />
      <Gap y={40} />
    </Container>
  );
}