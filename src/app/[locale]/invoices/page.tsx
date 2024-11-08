import React from "react";
import { ManageInvoiceList } from "@/app/[locale]/invoices/ManageInvoiceList";
import PageLayout from "@/components/PageLayout";
import { getTranslations } from "next-intl/server";
import { Heading } from "@/components/ui/texts";
import { listInvoices } from "@/resources/invoices/invoice.service";


export default async function Invoice() {
  const t = await getTranslations("invoiceManagement");
  const initialInvoiceListResponse = await listInvoices();
  return (
    <PageLayout>
      <Heading>
        {t("invoiceManagement")}
      </Heading>
      <ManageInvoiceList initialInvoiceListResponse={initialInvoiceListResponse}/>
    </PageLayout>
  );
}