import { useLocale, useTranslations } from "next-intl";
import { Col, Row } from "@/components/ui/common";
import {
  BidRequestMessagesResponseT,
  listBidRequestMessages
} from "@/resources/bidRequestMessages/bidRequestMessage.controller";
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { BidRequestStatus } from "@/resources/bidRequests/dtos/bidRequest.dto";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import useTokenInfo from "@/hooks/tokenInfo";
import { Skeleton } from "@/shadcn/ui/skeleton";
import ViewOfferSection from "@/app/[locale]/offers/components/OfferDetails";
import Controls from "@/app/[locale]/offers/components/Controls";
import useSafeAction from "@/hooks/safeAction";
import useReload from "@/hooks/reload";
import { clsx } from "clsx";
import { BidRequestWithMetaDataT } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";

// TODO 페이지네이션 없음
export default function BidRequestMessageList({ curBidRequest, setCurBidRequest }: {
  curBidRequest: BidRequestWithMetaDataT;
  setCurBidRequest: Dispatch<SetStateAction<BidRequestWithMetaDataT>>;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const { reload, reloadKey } = useReload();
  const [messagesResponse, setMessagesResponse] = useState<BidRequestMessagesResponseT>();

  const boundListBidRequestMessages = useMemo(() => listBidRequestMessages.bind(null, curBidRequest.id), [curBidRequest.id]);
  const { execute } = useSafeAction(boundListBidRequestMessages, {
    onSuccess: ({ data }) => setMessagesResponse(data)
  });
  useEffect(() => {
    execute();
  }, [execute, reloadKey]);

  const { tokenInfo } = useTokenInfo();
  const tBidRequestStatus = useTranslations("bidRequestStatus");
  if (!messagesResponse) {
    return <div>
      <Skeleton className="w-full h-[40px] my-[20px]" />
      <Skeleton className="w-full h-[40px] my-[20px]" />
    </div>;
  }

  const { messages, invoice } = messagesResponse;
  const done = determineIfDone(curBidRequest, messages);

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
      {(messages.length === 0 && !done.isDone)
        && <Controls bidRequestId={curBidRequest.id}
          reload={reload}
          setCurBidRequest={setCurBidRequest}
          whoCanDecideAtThisTurn={UserTypeT.Creator}
        />}
    </MessageRow>

    {messages.map((message, index) => (
      <MessageRow
        key={index}
        seq={index + 1}
        user={message.user}
        createdAt={message.createdAt}
        statusLabel={tokenInfo?.userId === message.user.id ? "제안" : "수정 요청"}
      >
        <MessageContentBox content={message.content} />
        {(messages.length - 1 === index && !done.isDone)
          && <Controls bidRequestId={curBidRequest.id}
            reload={reload}
            setCurBidRequest={setCurBidRequest}
            whoCanDecideAtThisTurn={message.user.userType === UserTypeT.Creator
              ? UserTypeT.Buyer : UserTypeT.Creator}
            refMessageId={messages[messages.length - 1].id}
          />}
        {/*  바이어에게 받으면 저작권자, 혹은 그의 반대로 수락/거절 가능 */}
      </MessageRow>
    ))}
    {done.isDone
      && <MessageRow
        seq={messages.length + 1}
        user={done.doneBy}
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
  const tGeneral = useTranslations("general");
  const locale = useLocale();
  const { tokenInfo } = useTokenInfo();
  return <>
    <Row className={clsx({
      "bg-[#376C49] rounded-[10px]": showDetails
    })}>
      <div className="w-[20%] p-2 flex justify-center">{seq + 1}</div>
      <div className="w-[20%] p-2 flex justify-center">{createdAt.toLocaleString(locale)}</div>
      <div className="w-[20%] p-2 flex justify-center">
        {tokenInfo?.userId === user.id ? "나" : user.name}
      </div>
      <div className="w-[20%] p-2 flex justify-center clickable"
        onClick={() => setShowDetails(prev => !prev)}>
        {showDetails ? tGeneral("collapse") : tGeneral("expand")}
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

const determineIfDone = (
  curBidRequest: BidRequestWithMetaDataT,
  messages: BidRequestMessagesResponseT["messages"],
) => {
  const isDone = curBidRequest.status === BidRequestStatus.Accepted
    || curBidRequest.status === BidRequestStatus.Declined;
  if (!isDone) {
    return { isDone };
  }
  const lastMessage = messages[messages.length - 1];
  return {
    isDone,
    // 마지막 메시지의 수령자가 마지막 결정 가능
    doneBy: lastMessage.user.userType === UserTypeT.Creator
      ? curBidRequest.buyer.user
      : curBidRequest.creator.user
  };
};