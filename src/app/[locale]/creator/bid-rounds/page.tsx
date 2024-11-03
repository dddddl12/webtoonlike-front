import React from "react";
import { Col, Gap } from "@/ui/layouts";
import PageLayout from "@/components/PageLayout";
import { listMyWebtoonsNotOnSale, listMyWebtoonsOnSale } from "@/resources/webtoons/webtoon.service";
import { getTranslations } from "next-intl/server";
import BidRoundListNotOnSale from "@/app/[locale]/creator/bid-rounds/BidRoundListNotOnSale";
import BidRoundListOnSale from "@/app/[locale]/creator/bid-rounds/BidRoundListOnSale";

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
        <h1 className="font-bold text-3xl mb-10">
          {t("unregisteredSeries")}
        </h1>
        <BidRoundListNotOnSale initialWebtoonListResponse={initialWebtoonListNotOnSaleResponse} />
      </Col>
      <Gap y={20} />
      <Col>
        <h1 className="font-bold text-3xl mb-10">
          {t("registeredSeries")}
        </h1>
        <BidRoundListOnSale initialWebtoonListResponse={initialWebtoonListOnSaleResponse} />
      </Col>
    </PageLayout>
  );
}