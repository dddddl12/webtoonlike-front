import React from "react";
import { Col, Gap } from "@/ui/layouts";
import PageLayout from "@/components/PageLayout";
import { listMyWebtoonsNotOnSale, listMyWebtoonsOnSale } from "@/resources/webtoons/webtoon.service";
import { getTranslations } from "next-intl/server";
import MyWebtoonsNotOnSale from "@/app/[locale]/my-webtoons/MyWebtoonsNotOnSale";
import MyWebtoonsOnSale from "@/app/[locale]/my-webtoons/MyWebtoonsOnSale";
import { Heading } from "@/ui/texts";

export default async function MyWebtoonsPage() {
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
        <MyWebtoonsNotOnSale initialWebtoonListResponse={initialWebtoonListNotOnSaleResponse} />
      </Col>
      <Gap y={20} />
      <Col>
        <Heading>
          {t("registeredSeries")}
        </Heading>
        <MyWebtoonsOnSale initialWebtoonListResponse={initialWebtoonListOnSaleResponse} />
      </Col>
    </PageLayout>
  );
}