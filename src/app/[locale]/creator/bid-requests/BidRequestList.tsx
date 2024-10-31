"use client";

import React, { useEffect, useState, useRef } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { BidRequestT } from "@/resources/bidRequests/bidRequest.types";
import { listBidRequests } from "@/resources/bidRequests/bidRequest.service";
import { Paginator } from "@/ui/tools/Paginator";
import { BidRequestMessageT } from "@/resources/bidRequestMessages/bidRequestMessage.types";

type BidRequestList = {
  items: BidRequestT[];
  totalPages: number;
}

export function BidRequestList({ initialBidRequestList }: {
  initialBidRequestList: BidRequestList
}) {
  const t = useTranslations("manageOffers");

  const [page, setPage] = useState<number>(0);
  const [fetchingNewList, setFetchingNewList] = useState(false);
  const [bidRequestList, setBidRequestList] = useState<BidRequestList>(initialBidRequestList);
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      // Skip the effect during the initial render
      isInitialRender.current = false;
      return;
    }
    setFetchingNewList(true);
    listBidRequests({ page }).then(newList => {
      setBidRequestList(newList);
      setFetchingNewList(false);
    });
  }, [page]);

  if (fetchingNewList) {
    return <Spinner />;
  }
  if (bidRequestList.items.length === 0) {
    return <Row className="rounded-md bg-gray-darker h-[84px] justify-center">
      <Text className="text-white">오퍼가 없습니다.</Text>
    </Row>;
  }

  return <>
    <Col>
      <div className="flex p-2 text-white">
        <div className="w-[40%] p-2 flex justify-start font-bold">{t("seriesName")}</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">오퍼 제출 날짜</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">협상 내역 보기</div>
        <div className="w-[20%] p-2 flex justify-center font-bold">{t("status")}</div>
      </div>

      {bidRequestList.items.map((bidRequest) => (
        <TableRow key={bidRequest.id} bidRequest={bidRequest} />
      ))}
    </Col>
    <Paginator
      currentPage={page}
      totalPages={bidRequestList.totalPages}
      onPageChange={setPage}
      pageWindowLen={2}
    />
  </>;
}

function TableRow({ bidRequest }:{
  bidRequest: BidRequestT
}) {
  const router = useRouter();
  const locale = useLocale();
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const TbidRequestStatus = useTranslations("bidRequestStatus");
  const webtoon = bidRequest.round?.webtoon;
  return (
    <>
      <div className="flex p-2 mt-4 text-white rounded-md bg-black-texts items-center">
        <div className="w-[40%] p-2 flex justify-start items-center">
          <div className="w-[60px] h-[60px] overflow-hidden relative rounded-sm">
            <Image
              src={webtoon?.thumbPath ? buildImgUrl(null, webtoon?.thumbPath, { size: "xs" }) : "/img/webtoon_default_image_small.svg"}
              alt={`${webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={4} />
          <div
            className="underline cursor-pointer"
            onClick={() => {router.push(`/webtoons/${webtoon?.id}`);}}>
            {locale === "ko" ? webtoon?.title : webtoon?.title_en ?? webtoon?.title}
          </div>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequest.createdAt.toLocaleString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <span className="underline text-mint cursor-pointer"
            onClick={(e) => setShowMessages(prev => !prev)}>협상 내역 보기</span>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {TbidRequestStatus(bidRequest.round?.status)}
        </div>
      </div>
      {showMessages
        && <MessageList messages={bidRequest.BidRequestMessage}/>}
    </>
  );
}

function MessageList({ messages }: {messages: BidRequestMessageT[]}) {
  const locale = useLocale();
  if(messages.length === 0) {
    return <Col className="rounded-md bg-gray-darker p-4 flex-row justify-center">
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
    {messages.map((message, index) => (
      <Row key={index}>
        <div className="w-[20%] p-2 flex justify-center">{index + 1}</div>
        <div className="w-[20%] p-2 flex justify-center">{message.createdAt.toLocaleString(locale)}</div>
        <div className="w-[20%] p-2 flex justify-center">유저 {message.userId}</div>
        <div className="w-[20%] p-2 flex justify-center text-mint underline">보러가기</div>
        <div className="w-[20%] p-2 flex justify-center">{message.content}</div>
      </Row>
    ))}
  </Col>;
}