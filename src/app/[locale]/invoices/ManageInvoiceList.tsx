"use client";

import { Col } from "@/components/ui/common";
import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import { ListResponse } from "@/resources/globalTypes";
import { listInvoices } from "@/resources/invoices/controllers/invoice.controller";
import { useState } from "react";
import BidRequestDetailsForInvoice from "@/app/[locale]/invoices/BidRequestDetailsForInvoice";
import InvoiceDownload from "@/components/shared/InvoiceDownload";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { InvoiceWithWebtoonT } from "@/resources/invoices/dtos/invoice.dto";
import NoItems from "@/components/ui/NoItems";
import { Link } from "@/i18n/routing";

type InvoiceListResponse = ListResponse<InvoiceWithWebtoonT>;

export function ManageInvoiceList({ initialInvoiceListResponse }: {
  initialInvoiceListResponse: InvoiceListResponse;
}) {
  const t = useTranslations("invoiceManagement");
  const { listResponse, filters, setFilters } = useListData(
    listInvoices,
    { page: 1 },
    initialInvoiceListResponse
  );

  if (listResponse.items.length === 0) {
    return <NoItems message={t("noInvoiceIssued")}/>;
  }

  return <>
    <Col>
      <TableHeader/>
      {listResponse.items.map((invoice) => (
        <TableRow key={invoice.id} invoice={invoice}/>
      ))}
    </Col>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}


function TableHeader() {
  const t = useTranslations("invoiceManagement");
  return (
    <div className="flex p-2 text-white">
      <div className="w-[20%] p-2 flex justify-start font-bold">{t("seriesName")}</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("authorName")}</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("buyerName")}</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">협상 개요</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("issueDate")}</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("downloadInvoice")}</div>
    </div>
  );
}

function TableRow({ invoice }: { invoice: InvoiceWithWebtoonT }) {
  const locale = useLocale();
  const [showDetails, setShowDetails] = useState(false);
  const tGeneral = useTranslations("general");

  return (
    <>
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[20%] p-2 flex justify-start items-center">
          <WebtoonAvatar webtoon={invoice.webtoon}/>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <Link href={`/creators/${invoice.creator.user.id}`} className="clickable">
            {invoice.creator.user.name}
          </Link>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {invoice.buyer.user.name}
        </div>

        <div className="w-[20%] p-2 flex justify-center clickable"
          onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? tGeneral("collapse") : tGeneral("expand")}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {invoice.createdAt.toLocaleDateString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <InvoiceDownload invoice={invoice}/>
        </div>
      </div>
      {showDetails
        && <BidRequestDetailsForInvoice
          bidRequestId={invoice.bidRequestId}/>}
    </>
  );
}
