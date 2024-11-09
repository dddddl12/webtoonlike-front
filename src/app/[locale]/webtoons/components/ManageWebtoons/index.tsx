import React from "react";
import { Col, Gap } from "@/shadcn/ui/layouts";
import PageLayout from "@/components/PageLayout";
import { listMyWebtoonsNotOnSale, listMyWebtoonsOnSale } from "@/resources/webtoons/webtoon.service";
import { getTranslations } from "next-intl/server";
import MyWebtoonsNotOnSale from "@/app/[locale]/webtoons/components/ManageWebtoons/MyWebtoonsNotOnSale";
import MyWebtoonsOnSale from "@/app/[locale]/webtoons/components/ManageWebtoons/MyWebtoonsOnSale";
import { Heading } from "@/shadcn/ui/texts";

export default async function ManageWebtoons() {
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