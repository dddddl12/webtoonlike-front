import React from "react";
import { InvoicedOfferList } from "@/app/[locale]/invoices/InvoicedOfferList";
import PageLayout from "@/components/ui/PageLayout";
import { getTranslations } from "next-intl/server";
import { Heading1 } from "@/components/ui/common";
import { listInvoicedOffers, listUninvoicedOffers } from "@/resources/invoices/controllers/invoice.controller";
import { Col } from "@/components/ui/common";
import { UninvoicedOfferList } from "@/app/[locale]/invoices/UninvoicedOfferList";
import { serverResponseHandler } from "@/handlers/serverResponseHandler";

export default async function Invoice() {
  const t = await getTranslations("invoiceManagement");
  const [initialUninvoicedListResponse, initialInvoicedListResponse] = await Promise.all([
    listUninvoicedOffers({}).then(serverResponseHandler),
    listInvoicedOffers({}).then(serverResponseHandler)
  ]);
  return (
    <PageLayout>
      <Col className="gap-20">
        <Col>
          <Heading1>
            미발급 인보이스
          </Heading1>
          <UninvoicedOfferList initialUninvoicedListResponse={initialUninvoicedListResponse}/>
        </Col>
        <Col>
          <Heading1>
            {t("invoiceManagement")}
          </Heading1>
          <InvoicedOfferList initialInvoicedListResponse={initialInvoicedListResponse}/>
        </Col>
      </Col>
    </PageLayout>
  );
}