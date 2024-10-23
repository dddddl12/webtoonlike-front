"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import { ErrorComponent } from "@/components/ErrorComponent";
import Spinner from "@/components/Spinner";
import { useListData } from "@/hooks/ListData";
import { Paginator } from "@/ui/tools/Paginator";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { convertTimeAbsolute } from "@/utils/time";
import { buildImgUrl } from "@/utils/media";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/shadcn/Accordion";
import { businessFieldConverterToKr } from "@/utils/businessFieldConverter";
import { nationConverterToKr } from "@/utils/nationConverter";
import { Button } from "@/ui/shadcn/Button";

export function ManageBidRoundRequestTab() {
  const router = useRouter();
  const locale = useLocale();

  const { data: bidRound$, actions: bidRoundAct } = useListData({
    listFn: BidRoundApi.list
  });

  const { status, data: bidRound } = bidRound$;

  const filteredBidRound = bidRound.filter((item) => item.requests && item.requests.length > 0);

  const [page, setPage] = useState<number>(0);
  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = bidRound$.numData || 0;

  const listOpt: ListBidRoundOptionT = {
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
    $webtoon: true,
    $user: true,
    $requests: true,
  };

  useEffect(() => {
    bidRoundAct.load(listOpt);
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
      <div className="flex">
        <div className="w-[30%] p-2 flex justify-start font-bold text-gray-shade">작품명</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">작가명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">제안 오퍼</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">게시 종료일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade"></div>
      </div>
    );
  }

  function TableRow(bidRound: BidRoundT) {
    const { data: bidRequest$, actions: bidRequesetAct } = useListData({
      listFn: async (listOpt) => {
        return await BidRequestApi.list(listOpt);
      },
    });

    const { status: bidRequestStatus, data: bidRequest } = bidRequest$;

    const listOpt: ListBidRequestOptionT = {
      $webtoon: true,
      $round: true,
      $buyer: true,
      $creator: true,
      limit: 10,
      roundId: bidRound.id,
    };

    function handleGetBidRequest(value: string) {
      if (value === "") return;
      bidRequesetAct.load(listOpt);
    }

    return (
      <Accordion type="single" collapsible onValueChange={handleGetBidRequest} className="p-0">
        <AccordionItem value={`item-${bidRound.id}`} className="p-0">
          <Row key={bidRound.id} className="w-full bg-white rounded-sm p-2 my-2 items-center">
            <Row className="w-[30%] p-2 flex justify-start">
              <div className="w-[50px] h-[50px] overflow-hidden relative rounded-sm">
                <Image
                  src={bidRound.webtoon?.thumbPath ? buildImgUrl(null, bidRound.webtoon.thumbPath, { size: "xxs" } ) : "/img/webtoon_default_image_small.svg"}
                  alt={`${bidRound.webtoon?.thumbPath}`}
                  style={{ objectFit: "cover" }}
                  fill
                />
              </div>
              <Gap x={2} />

              <div
                className="text-mint underline cursor-pointer"
                onClick={() => {router.push(`/webtoons/${bidRound.webtoon?.id}`);}}>
                {bidRound.webtoon?.title}
              </div>
            </Row>
            <div className="w-[15%] p-2 flex justify-center">{bidRound.user?.fullName}</div>
            <div className="w-[20%] p-2 flex justify-center">{`${bidRound.requests?.length}개`}</div>
            <div className="w-[20%] p-2 flex justify-center">{bidRound.negoStartAt ? convertTimeAbsolute(bidRound.negoStartAt) : "-"}</div>
            <div className="w-[15%] p-2 flex justify-center">
              <AccordionTrigger className="p-0">
                <Button variant="default">
                  {locale === "ko" ? "내역 보기" : "History"}
                </Button>
              </AccordionTrigger>
            </div>
          </Row>
          <AccordionContent>
            <Col className="w-full bg-white rounded-sm p-2 items-center">
              <Row className="w-full">
                <div className="w-[10%] p-2 flex justify-start font-bold text-gray-shade">바이어명</div>
                <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">오퍼 발송일</div>
                <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">현재 상태</div>
                <div className="w-[40%] p-2 flex justify-center font-bold text-gray-shade">희망 판권</div>
                <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade"></div>
              </Row>
              {bidRequest.map((item) => {
                const priorityStatus = item.approvedAt
                  ? "오퍼 승인"
                  : item.acceptedAt
                    ? "오퍼 수락"
                    : item.cancelledAt
                      ? "오퍼 취소"
                      : item.rejectedAt
                        ? "오퍼 거절"
                        : "진행 중";
                return (
                  <Row key={item.id} className="w-full bg-white rounded-sm p-2 items-center">
                    <div className="w-[10%] p-2 flex justify-start">{item.buyer?.name}</div>
                    <div className="w-[20%] p-2 flex justify-center">{convertTimeAbsolute(item.createdAt)}</div>
                    <div className="w-[15%] p-2 flex justify-center">{priorityStatus}</div>
                    <div className="w-[40%] p-2 flex justify-center">
                      {/*TODO*/}
                      {/*{item.contractRange.data.map((item) =>*/}
                      {/*  item.businessField === "webtoon" ?*/}
                      {/*    `${businessFieldConverterToKr(item.businessField)}(${nationConverterToKr(item.country)}), ` :*/}
                      {/*    `2차(${businessFieldConverterToKr(item.businessField)}), `*/}
                      {/*)}*/}
                    </div>
                    <div className="w-[15%] p-2 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          router.push(`/creator/bid-requests/${item.roundId}/condition/${item.id}`);
                        }}
                      >
                        {locale === "ko" ? "협상 보기" : "Negotitation"}
                      </Button>
                    </div>
                  </Row>
                );
              })}
            </Col>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  function BidRoundTable(bidRound: BidRoundT[]) {
    return (
      <div className="flex flex-col">
        <TableHeader />
        {bidRound.map((item) => <TableRow key={item.id} {...item} />)}
      </div>
    );
  }

  return (
    <Container className="p-0">
      <Text className="font-bold text-[18pt]">오퍼 관리</Text>
      <Gap y={5} />
      {filteredBidRound.length > 0 ? (
        <>
          {BidRoundTable(filteredBidRound)}
          <Paginator
            currentPage={page}
            numData={totalNumData}
            itemsPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
      ) : (
        <Row className="justify-center bg-gray p-4 rounded-sm">
          <Text>현재 오퍼 중 작품이 없습니다</Text>
        </Row>
      )}
      <Gap y={60} />
    </Container>
  );
}
