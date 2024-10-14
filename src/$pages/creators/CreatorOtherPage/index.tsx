import React from "react";
import { Col, Container, Gap } from "@/ui/layouts";
import OtherCreatorInfoSection from "./OtherCreatorInfoSection";
import CreatorWebtoonList from "@/$pages/creators/CreatorOtherPage/CreatorWebtoonList";
import type { CreatorT } from "@backend/types/Creator";


type CreatorOtherPageProps = {
  creator: CreatorT;
};

export function CreatorOtherPage({ creator }: CreatorOtherPageProps) {

  return (
    <Container className="bg-[#121212]">
      <OtherCreatorInfoSection creator={creator} />
      <Col className="items-center m-auto">
        {/* THE WEBTOON LIST BY SAID CREATOR */}
        <CreatorWebtoonList creator={creator} />
      </Col>
      <Gap y={80} />
    </Container>
  );
}
