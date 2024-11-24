import React from "react";
import { ManageInvoiceList } from "@/app/[locale]/invoices/ManageInvoiceList";
import PageLayout from "@/components/ui/PageLayout";
import { getTranslations } from "next-intl/server";
import { Heading } from "@/components/ui/common";
import { listInvoices } from "@/resources/invoices/controllers/invoice.controller";
import { Col } from "@/components/ui/common";
import { UninvoicedBidRequestList } from "@/app/[locale]/invoices/UninvoicedBidRequestList";
import { responseHandler } from "@/handlers/responseHandler";
import { listUninvoicedBidRequests } from "@/resources/bidRequests/controllers/bidRequestWithMetadata.controller";

export default async function Invoice() {
  const t = await getTranslations("invoiceManagement");
  const [initialBidRequestListResponse, initialInvoiceListResponse] = await Promise.all([
    listUninvoicedBidRequests({}).then(responseHandler),
    listInvoices({}).then(responseHandler)
  ]);
  return (
    <PageLayout>
      <Col className="gap-20">
        <Col>
          <Heading>
            미발급 인보이스
          </Heading>
          <UninvoicedBidRequestList initialBidRequestListResponse={initialBidRequestListResponse}/>
        </Col>
        <Col>
          <Heading>
            {t("invoiceManagement")}
          </Heading>
          <ManageInvoiceList initialInvoiceListResponse={initialInvoiceListResponse}/>
        </Col>
      </Col>
    </PageLayout>
  );
}