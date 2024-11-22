import React from "react";
import { Col, Gap } from "@/shadcn/ui/layouts";
import PageLayout from "@/components/PageLayout";
import { listMyWebtoonsNotOnSale, listMyWebtoonsOnSale } from "@/resources/webtoons/webtoon.controller";
import { getTranslations } from "next-intl/server";
import MyWebtoonsNotOnSale from "@/app/[locale]/webtoons/components/ManageWebtoons/MyWebtoonsNotOnSale";
import MyWebtoonsOnSale from "@/app/[locale]/webtoons/components/ManageWebtoons/MyWebtoonsOnSale";
import { Heading } from "@/shadcn/ui/texts";
import { responseHandler } from "@/handlers/responseHandler";

export default async function ManageWebtoons() {
  const [
    initialWebtoonListNotOnSaleResponse,
    initialWebtoonListOnSaleResponse
  ] = await Promise.all([
    listMyWebtoonsNotOnSale({}).then(responseHandler),
    listMyWebtoonsOnSale({}).then(responseHandler)
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