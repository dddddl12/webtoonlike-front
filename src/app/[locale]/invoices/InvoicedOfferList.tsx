"use client";

import { Col } from "@/components/ui/common";
import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import { ListResponse } from "@/resources/globalTypes";
import { listInvoicedOffers } from "@/resources/invoices/controllers/invoice.controller";
import { useState } from "react";
import OfferDetailsForInvoice from "@/app/[locale]/invoices/OfferDetailsForInvoice";
import InvoiceDownload from "@/components/shared/InvoiceDownload";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { InvoicedOfferT } from "@/resources/invoices/dtos/invoice.dto";
import NoItems from "@/components/ui/NoItems";
import { Link } from "@/i18n/routing";

export function InvoicedOfferList({ initialInvoicedListResponse }: {
  initialInvoicedListResponse: ListResponse<InvoicedOfferT>;
}) {
  const t = useTranslations("invoiceManagement");
  const { listResponse, filters, setFilters } = useListData(
    listInvoicedOffers,
    { page: 1 },
    initialInvoicedListResponse
  );

  if (listResponse.items.length === 0) {
    return <NoItems message={t("noInvoiceIssued")}/>;
  }

  return <>
    <Col>
      <TableHeader/>
      {listResponse.items.map((offer, i) => (
        <TableRow key={i} offer={offer}/>
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

function TableRow({ offer }: { offer: InvoicedOfferT }) {
  const locale = useLocale();
  const [showDetails, setShowDetails] = useState(false);
  const tGeneral = useTranslations("general");

  return (
    <>
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[20%] p-2 flex justify-start items-center">
          <WebtoonAvatar webtoon={offer.webtoon}/>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <Link href={`/creators/${offer.creator.user.id}`} className="clickable">
            {offer.creator.user.name}
          </Link>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {offer.buyer.user.name}
        </div>

        <div className="w-[20%] p-2 flex justify-center clickable"
          onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? tGeneral("collapse") : tGeneral("expand")}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {offer.invoice.createdAt.toLocaleDateString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <InvoiceDownload offer={offer}/>
        </div>
      </div>
      {showDetails
        && <OfferDetailsForInvoice
          offerProposalId={offer.offerProposal.id}/>}
    </>
  );
}
