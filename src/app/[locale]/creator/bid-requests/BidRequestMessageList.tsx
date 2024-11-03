import { useLocale } from "next-intl";
import { Col, Row } from "@/ui/layouts";
import Spinner from "@/components/Spinner";
import { useListData } from "@/hooks/listData";
import { listBidRequestMessages } from "@/resources/bidRequestMessages/bidRequestMessage.service";
import { Paginator } from "@/ui/tools/Paginator";

export default function BidRequestMessageList({ bidRequestId }: {
  bidRequestId: number
}) {
  const locale = useLocale();
  const { listResponse, filters, setFilters } = useListData(
    () => listBidRequestMessages(bidRequestId),
    { page: 1 }
  );

  if (!listResponse) {
    return <Spinner />;
  }
  if(listResponse.items.length === 0) {
    return <Col className="rounded-md bg-gray-darker p-4 flex-row justify-center">
      {/*TODO*/}
      메시지가 없습니다.
    </Col>;
  }
  return <Col className="rounded-md bg-gray-darker p-4">
    <Row className="border-b border-gray-text text-gray-text">
      <div className="w-[20%] p-2 flex justify-center">No.</div>
      <div className="w-[20%] p-2 flex justify-center">일자</div>
      <div className="w-[20%] p-2 flex justify-center">보낸 사람</div>
      <div className="w-[20%] p-2 flex justify-center">협의 내용</div>
      <div className="w-[20%] p-2 flex justify-center">메시지</div>
    </Row>
    {listResponse.items.map((message, index) => (
      <Row key={index}>
        <div className="w-[20%] p-2 flex justify-center">{index + 1}</div>
        <div className="w-[20%] p-2 flex justify-center">{message.createdAt.toLocaleString(locale)}</div>
        <div className="w-[20%] p-2 flex justify-center">유저 {message.user.name}</div>
        <div className="w-[20%] p-2 flex justify-center text-mint underline">보러가기</div>
        <div className="w-[20%] p-2 flex justify-center">{message.content}</div>
      </Row>
    ))}
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </Col>;
}