"use client";

import { Col, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { InvoiceExtendedT } from "@/resources/invoices/invoice.types";
import { PreviewInvoiceUser } from "@/app/[locale]/invoices/PreviewInvoiceUser";
import { Paginator } from "@/ui/tools/Paginator";
import { useListData } from "@/hooks/listData";
import { ListResponse } from "@/resources/globalTypes";
import { listInvoices } from "@/resources/invoices/invoice.service";
import { displayName } from "@/utils/displayName";

type InvoiceListResponse = ListResponse<InvoiceExtendedT>;

export function ManageInvoiceList({ initialInvoiceListResponse }: {
  initialInvoiceListResponse: InvoiceListResponse
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
      <TableHeader />
      {listResponse.items.map((invoice) => (
        <TableRow key={invoice.id} invoice={invoice} />
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
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("issueDate")}</div>
      <div className="w-[20%] p-2 flex justify-center font-bold">{t("downloadInvoice")}</div>
    </div>
  );
}

function TableRow({ invoice }: { invoice: InvoiceExtendedT}) {
  const locale = useLocale();
  return (
    <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
      <div className="w-[20%] p-2 flex justify-start items-center">
        <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
          <Image
            src={buildImgUrl(null, invoice.webtoon.thumbPath, { size: "xxs" } )}
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

      <div className="w-[20%] p-2 flex justify-center">
        {invoice.createdAt.toLocaleDateString(locale)}
      </div>

      <div className="w-[20%] p-2 flex justify-center">
        다운로드
        {/*TODO*/}
        {/*<PreviewInvoiceUser invoice={invoice} />*/}
      </div>
    </div>
  );
}
