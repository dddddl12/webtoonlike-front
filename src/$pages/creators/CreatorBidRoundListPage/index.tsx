import React from "react";
import { Container, Gap } from "@/ui/layouts";
import { BidRoundList } from "./BidRoundList";
import { CreatorOwnWebtoonList } from "./CreatorOwnWebtoonList";


export function CreatorBidRoundListPage() {
  return (
    <Container className="bg-[#121212]">
      <Gap y={20} />
      <CreatorOwnWebtoonList />
      <Gap y={20} />
      <BidRoundList />
      <Gap y={40} />
    </Container>
  );
}