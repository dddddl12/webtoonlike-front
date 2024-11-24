import React from "react";
import { Col } from "@/components/ui/common";
import PageLayout from "@/components/ui/PageLayout";
import { getTranslations } from "next-intl/server";
import MyWebtoonsNotOnSale from "@/app/[locale]/webtoons/components/ManageWebtoons/MyWebtoonsNotOnSale";
import MyWebtoonsOnSale from "@/app/[locale]/webtoons/components/ManageWebtoons/MyWebtoonsOnSale";
import { Heading } from "@/components/ui/common";
import { responseHandler } from "@/handlers/responseHandler";
import {
  listMyWebtoonsNotOnSale,
  listMyWebtoonsOnSale
} from "@/resources/webtoons/controllers/webtoonPreview.controller";

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
      <Col className="mt-20">
        <Heading>
          {t("registeredSeries")}
        </Heading>
        <MyWebtoonsOnSale initialWebtoonListResponse={initialWebtoonListOnSaleResponse} />
      </Col>
    </PageLayout>
  );
}