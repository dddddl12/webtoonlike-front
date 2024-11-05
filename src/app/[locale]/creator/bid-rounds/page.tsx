import React from "react";
import { Col, Gap } from "@/ui/layouts";
import PageLayout from "@/components/PageLayout";
import { listMyWebtoonsNotOnSale, listMyWebtoonsOnSale } from "@/resources/webtoons/webtoon.service";
import { getTranslations } from "next-intl/server";
import BidRoundListNotOnSale from "@/app/[locale]/creator/bid-rounds/BidRoundListNotOnSale";
import BidRoundListOnSale from "@/app/[locale]/creator/bid-rounds/BidRoundListOnSale";
import { Heading } from "@/ui/texts";

export default async function BidRound() {
  const [
    initialWebtoonListNotOnSaleResponse,
    initialWebtoonListOnSaleResponse
  ] = await Promise.all([
    listMyWebtoonsNotOnSale(),
    listMyWebtoonsOnSale()
  ]);

  const t = await getTranslations("manageContents");
  return (
    <PageLayout>
      <Col>
        <Heading>
          {t("unregisteredSeries")}
        </Heading>
        <BidRoundListNotOnSale initialWebtoonListResponse={initialWebtoonListNotOnSaleResponse} />
      </Col>
      <Gap y={20} />
      <Col>
        <Heading>
          {t("registeredSeries")}
        </Heading>
        <BidRoundListOnSale initialWebtoonListResponse={initialWebtoonListOnSaleResponse} />
      </Col>
    </PageLayout>
  );
}