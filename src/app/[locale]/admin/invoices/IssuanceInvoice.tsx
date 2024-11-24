import Spinner from "@/components/ui/Spinner";
import { IssuanceInvoiceSubmit } from "./IssuanceInvoiceSubmit";
import useListData from "@/hooks/listData";
import { Row } from "@/components/ui/common";
import Paginator from "@/components/ui/Paginator";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { adminListUninvoicedBidRequests } from "@/resources/bidRequests/controllers/bidRequestWithMetadata.controller";
import { BidRequestWithMetaDataT } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";
import NoItems from "@/components/ui/NoItems";

export default function IssuanceInvoice({ reload }: {
  reload: () => void;
}) {
  const { listResponse, filters, setFilters } = useListData(
    adminListUninvoicedBidRequests, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <NoItems message="현재 협상된 작품이 없습니다."/>;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex p-2">
          <div className="w-[30%] p-2 font-bold text-gray-shade">작품명</div>
          <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">작가명</div>
          <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">바이어명</div>
          <div className="w-[25%] p-2 flex justify-center font-bold text-gray-shade">신청일</div>
          <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">인보이스 발행</div>
        </div>
        {listResponse.items.map((bidRequest, i) => (
          <TableRow key={i} bidRequest={bidRequest} reload={reload} />
        ))}
      </div>
      <Paginator
        currentPage={filters.page}
        totalPages={listResponse.totalPages}
        setFilters={setFilters}
      />
    </>
  );
}

function TableRow({ bidRequest,reload }: {
  bidRequest: BidRequestWithMetaDataT;
  reload: () => void;
}) {
  return (
    <Row className="flex bg-white rounded-sm p-2 my-2">
      <div className="w-[30%] p-2 flex justify-start">
        <WebtoonAvatar webtoon={bidRequest.webtoon}/>
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        <p className="clickable">{bidRequest.creator.user.name}</p>
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        <p className="clickable">{bidRequest.buyer.user.name}</p>
      </div>
      <div className="w-[25%] p-2 flex justify-center">
        <p className=" cursor-pointer">{bidRequest.createdAt.toLocaleString("ko")}</p>
      </div>
      <div className="w-[15%] flex justify-center items-center">
        <IssuanceInvoiceSubmit bidRequestId={bidRequest.id} reload={reload} />
      </div>
    </Row>
  );
}
