import React from "react";
import { ManageInvoiceList } from "@/app/[locale]/invoices/ManageInvoiceList";
import PageLayout from "@/components/PageLayout";
import { getTranslations } from "next-intl/server";
import { Heading } from "@/shadcn/ui/texts";
import { listInvoices } from "@/resources/invoices/invoice.service";
import { listBidRequests } from "@/resources/bidRequests/bidRequest.service";
import { Col } from "@/shadcn/ui/layouts";
import { UninvoicedBidRequestList } from "@/app/[locale]/invoices/UninvoicedBidRequestList";


export default async function Invoice() {
  const t = await getTranslations("invoiceManagement");
  const [initialBidRequestListResponse, initialInvoiceListResponse] = await Promise.all([
    listBidRequests({ excludeInvoiced: true, limit: 5 }),
    listInvoices()
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