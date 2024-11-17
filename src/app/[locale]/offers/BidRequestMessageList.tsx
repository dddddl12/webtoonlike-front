import { useLocale, useTranslations } from "next-intl";
import { Col, Row } from "@/shadcn/ui/layouts";
import {
  BidRequestMessagesResponseT,
  listBidRequestMessages
} from "@/resources/bidRequestMessages/bidRequestMessage.service";
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { SimpleBidRequestT } from "@/resources/bidRequests/bidRequest.service";
import { BidRequestStatus } from "@/resources/bidRequests/bidRequest.types";
import { UserTypeT } from "@/resources/users/user.types";
import { useTokenInfo } from "@/hooks/tokenInfo";
import { Skeleton } from "@/shadcn/ui/skeleton";
import ViewOfferSection from "@/app/[locale]/offers/components/OfferDetails";
import Controls from "@/app/[locale]/offers/components/Controls";
import { useAction } from "next-safe-action/hooks";
import { clientErrorHandler } from "@/handlers/clientErrorHandler";

// TODO 페이지네이션 없음
export default function BidRequestMessageList({ curBidRequest, setCurBidRequest }: {
  curBidRequest: SimpleBidRequestT;
  setCurBidRequest: Dispatch<SetStateAction<SimpleBidRequestT>>;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [headingRef]);

  const [reloadMessages, setReloadMessages] = useState(true);
  const [messagesResponse, setMessagesResponse] = useState<BidRequestMessagesResponseT>();

  const boundListBidRequestMessages = useMemo(() => listBidRequestMessages.bind(null, curBidRequest.id), [curBidRequest.id]);
  const { execute } = useAction(boundListBidRequestMessages, {
    onSuccess: ({ data }) => setMessagesResponse(data),
    onError: clientErrorHandler
  });
  useEffect(() => {
    if (reloadMessages) {
      setReloadMessages(false);
      execute();
    }
  }, [execute, reloadMessages]);

  const tBidRequestStatus = useTranslations("bidRequestStatus");
  if (!messagesResponse) {
    return <div>
      <Skeleton className="w-full h-[40px] my-[20px]" />
      <Skeleton className="w-full h-[40px] my-[20px]" />
    </div>;
  }

  const { messages, invoice } = messagesResponse;
  const isDone = curBidRequest.status === BidRequestStatus.Accepted
    || curBidRequest.status === BidRequestStatus.Declined;

  return <Col className="rounded-md p-4 bg-gray-darker" ref={headingRef}>
    <Row className="border-b border-gray-text text-gray-text">
      <div className="w-[20%] p-2 flex justify-center">No.</div>
      <div className="w-[20%] p-2 flex justify-center">일자</div>
      <div className="w-[20%] p-2 flex justify-center">보낸 사람</div>
      <div className="w-[20%] p-2 flex justify-center">협의 내용</div>
      <div className="w-[20%] p-2 flex justify-center">현황</div>
    </Row>

    <MessageRow
      seq={0}
      user={curBidRequest.buyer.user}
      createdAt={curBidRequest.createdAt}
      statusLabel={"제안"}
    >
      <ViewOfferSection bidRequest={curBidRequest} />
      {(messages.length === 0 && !isDone)
        && <Controls bidRequestId={curBidRequest.id}
          setReloadMessages={setReloadMessages}
          setCurBidRequest={setCurBidRequest}
        />}
    </MessageRow>

    {messages.map((message, index) => (
      <MessageRow
        key={index}
        seq={index}
        user={message.user}
        createdAt={message.createdAt}
        statusLabel={message.user.userType === UserTypeT.Creator
          ? "수정 요청" : "제안"}
      >
        <MessageContentBox content={message.content} />
        {(messages.length - 1 === index && !isDone)
          && <Controls bidRequestId={curBidRequest.id}
            setReloadMessages={setReloadMessages}
            setCurBidRequest={setCurBidRequest}
          />}
      </MessageRow>
    ))}
    {isDone
      && <MessageRow
        seq={messages.length + 1}
        user={curBidRequest.creator.user}
        createdAt={curBidRequest.createdAt}
        statusLabel={tBidRequestStatus(curBidRequest.status)}>
        <MessageContentBox content={tBidRequestStatus(curBidRequest.status)} />
      </MessageRow>}

    {!!invoice
    && <MessageRow
      seq={messages.length + 2}
      user={{
        id: -1,
        name: "관리자"
      }}
      createdAt={invoice.createdAt}
      statusLabel={"인보이스 발생"}>
      <MessageContentBox content={"인보이스 발생"} />
    </MessageRow>}
  </Col>;
}

function MessageRow({ seq, createdAt, user, statusLabel, children }: {
  seq: number;
  createdAt: Date;
  user: {
    id: number;
    name: string;
  };
  statusLabel: string;
  children: ReactNode;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const locale = useLocale();
  const { tokenInfo } = useTokenInfo();
  return <>
    <Row>
      <div className="w-[20%] p-2 flex justify-center">{seq + 1}</div>
      <div className="w-[20%] p-2 flex justify-center">{createdAt.toLocaleString(locale)}</div>
      <div className="w-[20%] p-2 flex justify-center">
        {tokenInfo?.userId === user.id ? "나" : user.name}
      </div>
      <div className="w-[20%] p-2 flex justify-center text-mint underline cursor-pointer"
        onClick={() => setShowDetails(prev => !prev)}>
        {showDetails ? "접기" : "보기"}
      </div>
      <div className="w-[20%] p-2 flex justify-center">{statusLabel}</div>
    </Row>
    {showDetails && <Col className="mx-16">
      {children}
    </Col>}
  </>;
}

function MessageContentBox({ content }: {content: string}) {
  return <div className="bg-black-texts p-4 rounded-sm my-5">
    {content}
  </div>;
}