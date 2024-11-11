import { useLocale } from "next-intl";
import { Col, Row } from "@/shadcn/ui/layouts";
import Spinner from "@/components/Spinner";
import { useListData } from "@/hooks/listData";
import { listBidRequestMessages } from "@/resources/bidRequestMessages/bidRequestMessage.service";
import Paginator from "@/components/Paginator";
import { BidRequestMessageExtendedT } from "@/resources/bidRequestMessages/bidRequestMessage.types";
import { useState } from "react";
import NegotiationDetails from "@/app/[locale]/invoices/NegotiationDetails";
import { BidRequestExtendedT } from "@/resources/bidRequests/bidRequest.types";
import ViewOfferSection from "@/app/[locale]/offers/components/OfferDetails";
import Controls from "@/app/[locale]/offers/components/Controls";

export default function BidRequestMessageList({ bidRequest }: {
  bidRequest: BidRequestExtendedT;
}) {
  const { listResponse, filters, setFilters } = useListData(
    () => listBidRequestMessages(bidRequest.id),
    { page: 1, limit: 100 }
  );

  if (!listResponse) {
    return <Spinner />;
  }

  return <Col className="rounded-md p-4">
    <Row className="border-b border-gray-text text-gray-text bg-gray-darker">
      <div className="w-[20%] p-2 flex justify-center">No.</div>
      <div className="w-[20%] p-2 flex justify-center">일자</div>
      <div className="w-[20%] p-2 flex justify-center">보낸 사람</div>
      <div className="w-[20%] p-2 flex justify-center">협의 내용</div>
      <div className="w-[20%] p-2 flex justify-center">현황</div>
    </Row>
    <FirstRow bidRequest={bidRequest} />
    {listResponse.items.map((message, index) => (
      <MessageRow message={message} index={index + 1} key={index} />
    ))}
    {/*<Paginator*/}
    {/*  currentPage={filters.page}*/}
    {/*  totalPages={listResponse.totalPages}*/}
    {/*  setFilters={setFilters}*/}
    {/*/>*/}
    {/*todo*/}
  </Col>;
}

function FirstRow({ bidRequest }: {
  bidRequest: BidRequestExtendedT;
}) {
  const [showContent, setShowContent] = useState(false);
  const locale = useLocale();

  return <>
    <Row className="bg-gray-darker">
      <div className="w-[20%] p-2 flex justify-center">{1}</div>
      <div className="w-[20%] p-2 flex justify-center">{bidRequest.createdAt.toLocaleString(locale)}</div>
      <div className="w-[20%] p-2 flex justify-center">{bidRequest.username}</div>
      <div className="w-[20%] p-2 flex justify-center text-mint underline cursor-pointer"
        onClick={() => setShowContent(!showContent)}>
        {showContent ? "접기" : "보기"}
      </div>
      <div className="w-[20%] p-2 flex justify-center">제안</div>
    </Row>
    {showContent && <Col>
      <ViewOfferSection bidRequest={bidRequest}/>
      <Controls bidRequestId={bidRequest.id} />
    </Col>}
  </>;

}

function MessageRow({ message, index }: {
  index: number;
  message: BidRequestMessageExtendedT;
}) {
  const locale = useLocale();
  const [showNegotiation, setShowNegotiation] = useState(false);
  return <>
    <Row className="bg-gray-darker">
      <div className="w-[20%] p-2 flex justify-center">{index + 1}</div>
      <div className="w-[20%] p-2 flex justify-center">{message.createdAt.toLocaleString(locale)}</div>
      <div className="w-[20%] p-2 flex justify-center">{message.user.name}</div>
      <div className="w-[20%] p-2 flex justify-center text-mint underline cursor-pointer"
        onClick={() => setShowNegotiation(!showNegotiation)}>
        {showNegotiation ? "접기" : "보기"}
      </div>
      <div className="w-[20%] p-2 flex justify-center">수정 요청</div>
    </Row>
    {showNegotiation && <Col>
      <NegotiationDetails content={message.content}/>
      <Controls bidRequestId={message.bidRequestId} />
    </Col>}
  </>;
}
