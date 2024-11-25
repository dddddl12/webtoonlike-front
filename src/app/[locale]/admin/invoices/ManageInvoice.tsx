import Spinner from "@/components/ui/Spinner";
import { adminListInvoices } from "@/resources/invoices/controllers/invoice.controller";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import { Col } from "@/components/ui/common";
import InvoiceDownload from "@/components/shared/InvoiceDownload";
import { InvoiceWithWebtoonT } from "@/resources/invoices/dtos/invoice.dto";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";

export default function ManageInvoice() {
  const { listResponse, filters, setFilters } = useListData(
    adminListInvoices, {
      page: 1,
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <NoItems message="현재까지 발행한 인보이스 기록이 없습니다."/>;
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
      {listResponse.items.map((invoice: InvoiceWithWebtoonT, i) => (
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
  invoice: InvoiceWithWebtoonT;
}) {
  return (
    <div className="flex bg-white rounded-sm p-2 my-2">
      <div className="w-[20%] p-2 flex justify-start">
        <WebtoonAvatar webtoon={invoice.webtoon}/>
      </div>
      <div className="w-[20%] p-2 flex justify-center">
        <p className="clickable">{invoice.creator.user.name}</p>
      </div>
      <div className="w-[20%] p-2 flex justify-center">
        <p className="clickable">{invoice.buyer.user.name}</p>
      </div>
      <div className="w-[20%] p-2 flex justify-center">{invoice.createdAt.toLocaleString("ko")}</div>
      <div className="w-[20%] p-2 flex justify-center">
        <InvoiceDownload invoice={invoice} />
      </div>
    </div>
  );
}