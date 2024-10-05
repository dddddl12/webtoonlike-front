import React from "react";
import { Col, Container, Gap } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import OtherCreatorInfoSection from "./OtherCreatorInfoSection";
import CreatorWebtoonList from "@/$pages/creators/CreatorOtherPage/CreatorWebtoonList";

import { CreatorT } from "@/types";

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
