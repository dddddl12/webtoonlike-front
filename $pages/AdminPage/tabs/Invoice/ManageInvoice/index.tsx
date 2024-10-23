"use client";

import { useListData } from "@/hooks/ListData";
import { useEffect, useState } from "react";
import { generateRandomString } from "@/utils/randomString";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Paginator } from "@/ui/tools/Paginator";
import { convertTimeAbsolute } from "@/utils/time";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { PreviewInvoiceAdmin } from "./PreviewInvoiceAdmin";
import { useRouter } from "@/i18n/routing";
import type { InvoiceT, ListInvoiceOptionT } from "@backend/types/Invoice";

export function ManageInvoice() {
  const router = useRouter();
  const { data: manageInvoice$, actions: manageInvoiceAct } = useListData({
    listFn: InvoiceApi.list
  });

  const { status, data: manageInvoice } = manageInvoice$;

  const [page, setPage] = useState<number>(0);
  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = manageInvoice$.numData || 0;

  const listOpt: ListInvoiceOptionT = {
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
    $webtoon: true,
    $creator: true,
    $buyer: true,
    $request: true,
  };

  useEffect(() => {
    manageInvoiceAct.load(listOpt);
  }, [page]);

  if (status == "idle" || status == "loading") {
    return <Spinner />;
  }

  if (status == "error") {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
    return (
      <div className="flex p-2">
        <div className="w-[20%] p-2 font-bold text-gray-shade">작품명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">작가명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">바이어명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">인보이스 발급일</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">인보이스 확인</div>
      </div>
    );
  }

  function TableRow(invoice: InvoiceT) {
    return (
      <div key={generateRandomString()} className="flex bg-white rounded-sm p-2 my-2">
        <Row className="w-[20%] p-2 flex justify-start">
          <div className="w-[50px] h-[50px] overflow-hidden relative rounded-sm">
            <Image
              src={invoice.webtoon?.thumbPath ? buildImgUrl(null, invoice.webtoon.thumbPath, { size: "xxs" } ) : "/img/webtoon_default_image_small.svg"}
              alt={`${invoice.webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={2} />
          <div
            className="text-mint underline cursor-pointer"
            onClick={() => {router.push(`/webtoons/${invoice.webtoon?.id}`);}}>
            {invoice.webtoon?.title}
          </div>
        </Row>
        <div className="w-[20%] p-2 flex justify-center">
          <Text className="text-mint underline cursor-pointer">{invoice.creator?.name}</Text>
        </div>
        <div className="w-[20%] p-2 flex justify-center">
          <Text className="text-mint underline cursor-pointer">{invoice.buyer?.companyInfo.name}</Text>
        </div>
        <div className="w-[20%] p-2 flex justify-center">{convertTimeAbsolute(invoice.createdAt)}</div>
        <div className="w-[20%] p-2 flex justify-center">
          <PreviewInvoiceAdmin invoice={invoice} />
        </div>
      </div>
    );
  }

  function ManageInvoiceTable(manageInvoice: InvoiceT[]) {
    return (
      <Col>
        <TableHeader />
        {manageInvoice.map((invoice: InvoiceT) => (
          <TableRow key={generateRandomString()} {...invoice} />
        ))}
      </Col>
    );
  }

  return (
    <Container className="p-0">
      <Text className="font-bold text-[18pt]">인보이스 관리</Text>
      <Gap y={4} />
      {manageInvoice.length > 0
        ? <>
          {ManageInvoiceTable(manageInvoice)}
          <Paginator
            currentPage={page}
            numData={totalNumData}
            itemsPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
        : <Row className="justify-center bg-gray p-4 rounded-sm"><Text>현재까지 발행한 인보이스 기록이 없습니다</Text></Row>}
    </Container>
  );
}
