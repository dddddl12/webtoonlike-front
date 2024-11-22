"use client";

import { Col, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Paginator from "@/components/Paginator";
import useListData from "@/hooks/listData";
import { ListResponse } from "@/resources/globalTypes";
import { InvoiceWithWebtoonT, listInvoices } from "@/resources/invoices/invoice.controller";
import { displayName } from "@/utils/displayName";
import { useState } from "react";
import BidRequestDetailsForInvoice from "@/app/[locale]/invoices/BidRequestDetailsForInvoice";
import InvoiceDownload from "@/components/InvoiceDownload";

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
    return <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
      <Text className="text-white">{t("noInvoiceIssued")}</Text>
    </Row>;
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
  const [showNegotiation, setShowNegotiation] = useState(false);
  const t = useTranslations("invoiceManagement");

  return (
    <>
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[20%] p-2 flex justify-start items-center">
          <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
            <Image
              src={buildImgUrl(invoice.webtoon.thumbPath, { size: "xxs" })}
              alt={invoice.webtoon.thumbPath}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Link
            className="text-mint underline cursor-pointer ml-4"
            href={`/webtoons/${invoice.webtoon.id}`}
          >
            {displayName(locale, invoice.webtoon.title, invoice.webtoon.title_en)}
          </Link>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {invoice.creatorUsername}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {invoice.buyerUsername}
        </div>

        <div className="w-[20%] p-2 flex justify-center text-mint underline cursor-pointer"
          onClick={() => setShowNegotiation(!showNegotiation)}>
          {showNegotiation ? "접기" : "보기"}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {invoice.createdAt.toLocaleDateString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <InvoiceDownload invoice={invoice}/>
        </div>
      </div>
      {showNegotiation
        && <BidRequestDetailsForInvoice
          bidRequestId={invoice.bidRequestId}/>}
    </>
  );
}
