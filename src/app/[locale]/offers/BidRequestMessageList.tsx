import { useLocale } from "next-intl";
import { Col, Row } from "@/shadcn/ui/layouts";
import Spinner from "@/components/Spinner";
import { useListData } from "@/hooks/listData";
import { listBidRequestMessages } from "@/resources/bidRequestMessages/bidRequestMessage.service";
import Paginator from "@/components/Paginator";
import { BidRequestMessageExtendedT } from "@/resources/bidRequestMessages/bidRequestMessage.types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import NegotiationDetails from "@/app/[locale]/invoices/NegotiationDetails";
import { BidRequestExtendedT } from "@/resources/bidRequests/bidRequest.types";
import ViewOfferSection from "@/app/[locale]/offers/components/OfferDetails";
import Controls from "@/app/[locale]/offers/components/Controls";

export default function BidRequestMessageList({ bidRequest, setRerender }: {
  bidRequest: BidRequestExtendedT;
  setRerender: Dispatch<SetStateAction<number>>;
}) {
  const finished = !!(bidRequest.approvedAt || bidRequest.rejectedAt);

  // Create a ref for the Heading component
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Scroll to the Heading component when rendered
  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [headingRef]);


  const { listResponse, filters, setFilters } = useListData(
    () => listBidRequestMessages(bidRequest.id),
    { page: 1, limit: 100 }
  );

  if (!listResponse) {
    return <Spinner />;
  }

  return <Col className="rounded-md p-4" ref={headingRef}>
    <Row className="border-b border-gray-text text-gray-text bg-gray-darker">
      <div className="w-[20%] p-2 flex justify-center">No.</div>
      <div className="w-[20%] p-2 flex justify-center">일자</div>
      <div className="w-[20%] p-2 flex justify-center">보낸 사람</div>
      <div className="w-[20%] p-2 flex justify-center">협의 내용</div>
      <div className="w-[20%] p-2 flex justify-center">현황</div>
    </Row>
    <FirstRow bidRequest={bidRequest} setRerender={setRerender} finished={finished} />
    {listResponse.items.map((message, index) => (
      <MessageRow message={message} index={index + 1} key={index} setRerender={setRerender} finished={finished} />
    ))}
    {finished
      && <LastRow bidRequest={bidRequest} index={listResponse.items.length + 1} />}

    {/*<Paginator*/}
    {/*  currentPage={filters.page}*/}
    {/*  totalPages={listResponse.totalPages}*/}
    {/*  setFilters={setFilters}*/}
    {/*/>*/}
    {/*todo*/}
  </Col>;
}

function FirstRow({ bidRequest, setRerender, finished }: {
  bidRequest: BidRequestExtendedT;
  setRerender: Dispatch<SetStateAction<number>>;
  finished: boolean;
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
      {!finished && <Controls bidRequestId={bidRequest.id} setRerender={setRerender}/>}
    </Col>}
  </>;

}

function MessageRow({ message, index, setRerender, finished }: {
  index: number;
  message: BidRequestMessageExtendedT;
  setRerender: Dispatch<SetStateAction<number>>;
  finished: boolean;
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
      {!finished && <Controls bidRequestId={message.bidRequestId} setRerender={setRerender}/>}
    </Col>}
  </>;
}

function LastRow({ bidRequest, index }: {
  bidRequest: BidRequestExtendedT;
  index: number;
}) {
  const [showContent, setShowContent] = useState(false);
  const locale = useLocale();
  const message = bidRequest.approvedAt ? "협상 완료" : "협상 중단";
  return <>
    <Row className="bg-gray-darker">
      <div className="w-[20%] p-2 flex justify-center">{index + 1}</div>
      <div className="w-[20%] p-2 flex justify-center">{(bidRequest.approvedAt || bidRequest.rejectedAt)?.toLocaleString(locale)}</div>
      <div className="w-[20%] p-2 flex justify-center">저작권자</div>
      <div className="w-[20%] p-2 flex justify-center text-mint underline cursor-pointer"
        onClick={() => setShowContent(!showContent)}>
        {showContent ? "접기" : "보기"}
      </div>
      <div className="w-[20%] p-2 flex justify-center">{message}</div>
    </Row>
    {showContent && <Col>
      <NegotiationDetails content={message + "되었습니다."}/>
    </Col>}
  </>;
}