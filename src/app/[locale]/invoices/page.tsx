import React from "react";
import { InvoicedOfferList } from "@/app/[locale]/invoices/InvoicedOfferList";
import PageLayout from "@/components/ui/PageLayout";
import { getTranslations } from "next-intl/server";
import { Heading } from "@/components/ui/common";
import { listInvoicedOffers, listUninvoicedOffers } from "@/resources/invoices/controllers/invoice.controller";
import { Col } from "@/components/ui/common";
import { UninvoicedOfferList } from "@/app/[locale]/invoices/UninvoicedOfferList";
import { responseHandler } from "@/handlers/responseHandler";

export default async function Invoice() {
  const t = await getTranslations("invoiceManagement");
  const [initialUninvoicedListResponse, initialInvoicedListResponse] = await Promise.all([
    listUninvoicedOffers({}).then(responseHandler),
    listInvoicedOffers({}).then(responseHandler)
  ]);
  return (
    <PageLayout>
      <Col className="gap-20">
        <Col>
          <Heading>
            미발급 인보이스
          </Heading>
          <UninvoicedOfferList initialUninvoicedListResponse={initialUninvoicedListResponse}/>
        </Col>
        <Col>
          <Heading>
            {t("invoiceManagement")}
          </Heading>
          <InvoicedOfferList initialInvoicedListResponse={initialInvoicedListResponse}/>
        </Col>
      </Col>
    </PageLayout>
  );
}