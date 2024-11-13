"use client";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import Spinner from "@/components/Spinner";
import { listInvoices } from "@/resources/invoices/invoice.service";
import Paginator from "@/components/Paginator";
import { Link } from "@/i18n/routing";
import { useListData } from "@/hooks/listData";
import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { InvoiceExtendedT } from "@/resources/invoices/invoice.types";

export default function ManageInvoice() {
  const { listResponse, filters, setFilters } = useListData(
    listInvoices, {
      page: 1,
      isAdmin: true
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <Row className="justify-center bg-gray p-4 rounded-sm">
      <p>현재까지 발행한 인보이스 기록이 없습니다</p>
    </Row>;
  }
  return <>
    <Col>
      <div className="flex p-2">
        <div className="w-[20%] p-2 font-bold text-gray-shade">작품명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">작가명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">바이어명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">인보이스 발급일</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">인보이스 확인</div>
      </div>
      {listResponse.items.map((invoice: InvoiceExtendedT, i) => (
        <TableRow key={i} invoice={invoice} />
      ))}
    </Col>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}

function TableRow({ invoice }: {
  invoice: InvoiceExtendedT;
}) {
  return (
    <div className="flex bg-white rounded-sm p-2 my-2">
      <Row className="w-[20%] p-2 flex justify-start">
        <div className="w-[50px] h-[50px] overflow-hidden relative rounded-sm">
          <Image
            src={buildImgUrl(invoice.webtoon.thumbPath, { size: "xxs" } )}
            alt={`${invoice.webtoon?.thumbPath}`}
            style={{ objectFit: "cover" }}
            fill
          />
        </div>
        <Gap x={2} />
        <Link
          className="text-mint underline cursor-pointer"
          href={`/webtoons/${invoice.webtoon?.id}`}>
          {invoice.webtoon?.title}
        </Link>
      </Row>
      <div className="w-[20%] p-2 flex justify-center">
        <p className="text-mint underline cursor-pointer">{invoice.creatorUsername}</p>
      </div>
      <div className="w-[20%] p-2 flex justify-center">
        <p className="text-mint underline cursor-pointer">{invoice.buyerUsername}</p>
      </div>
      <div className="w-[20%] p-2 flex justify-center">{invoice.createdAt.toLocaleString("ko")}</div>
      <div className="w-[20%] p-2 flex justify-center">
        다운로드
        {/*<PreviewInvoiceAdmin invoice={invoice} />*/}
      </div>
    </div>
  );
}