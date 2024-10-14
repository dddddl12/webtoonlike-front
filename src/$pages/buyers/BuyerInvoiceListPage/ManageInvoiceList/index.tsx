"use client";

import { useState } from "react";
import { useListData } from "@/hooks/ListData";
import { Pagenator } from "@/ui/tools/Pagenator";
import { Col, Gap, Row } from "@/ui/layouts";
import { Heading, Text } from "@/ui/texts";
import { convertTimeAbsolute } from "@/utils/time";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import * as InvoiceApi from "@/apis/invoices";
import type { InvoiceT, ListInvoiceOptionT } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { PreviewInvoiceUser } from "@/components/PreviewInvoiceUser";
import { useRouter } from "@/i18n/routing";
import { getServerUserInfo } from "@/utils/auth/server";

export function ManageInvoiceList() {
  const router = useRouter();
  const user = getServerUserInfo();
  const t = useTranslations("invoiceManagement");
  const locale = useLocale();

  const { data: invoices$, actions: invoicesAct } = useListData({
    listFn: async (listOpt) => {
      return await InvoiceApi.list(listOpt);
    },
  });

  const [page, setPage] = useState<number>(0);

  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = invoices$.numData || 0;


  const invoiceListOpt: ListInvoiceOptionT = {
    meId: user.id,
    $webtoon: true,
    $creator: true,
    $buyer: true,
    $request: true,
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
    buyerUid: user.id,
  };

  invoicesAct.load(invoiceListOpt);

  const { status: invoicesStatus, data: invoices } = invoices$;

  if (invoicesStatus == "idle" || invoicesStatus == "loading") {
    return <Spinner />;
  }
  if (invoicesStatus == "error") {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
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

  function TableRow(invoice: InvoiceT) {
    return (
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[20%] p-2 flex justify-start items-center">
          <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
            <Image
              src={invoice.webtoon?.thumbPath ? buildImgUrl(null, invoice.webtoon.thumbPath, { size: "xxs" } ) : "/img/webtoon_default_image_small.svg"}
              alt={`${invoice.webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={4} />
          <div
            className="text-mint underline cursor-pointer"
            onClick={() => {router.push(`/webtoons/${invoice.webtoon?.id}`);}}>
            {locale === "ko" ? invoice.webtoon?.title : invoice.webtoon?.title_en ?? invoice.webtoon?.title}
          </div>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {locale === "ko" ?
            invoice.webtoon?.authorDetail ?? invoice?.creator?.name ?? "알 수 없음" :
            invoice.webtoon?.authorDetail_en ?? invoice?.creator?.name_en ?? invoice.webtoon?.authorDetail ?? invoice.webtoon?.creator?.name ?? "Unknown"}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {invoice.buyer?.name}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {invoice.webtoon ? convertTimeAbsolute(invoice.createdAt) : "-"}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <PreviewInvoiceUser invoice={invoice} />
        </div>
      </div>
    );
  }

  function WebtoonTable(invoices: InvoiceT[]) {
    return (
      <Col>
        <TableHeader />
        {invoices.map((invoice) => (
          <TableRow key={invoice.id} {...invoice} />
        ))}
      </Col>
    );
  }

  return (
    <Col className="text-white">
      <Heading className="font-bold text-[26pt]">{t("invoiceManagement")}</Heading>
      <Gap y={10} />

      {invoices.length === 0
        ? <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
          <Text className="text-white">{t("noInvoiceIssued")}</Text>
        </Row>
        : <>
          {WebtoonTable(invoices)}
          <Pagenator
            page={page}
            numData={totalNumData}
            itemsPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
      }
    </Col>
  );
}