"use client";

import Image from "next/image";
import Spinner from "@/components/Spinner";
import { useListData } from "@/hooks/listData";
import { Col, Row } from "@/shadcn/ui/layouts";
import { AdminPageBidRoundWithOffersT, listBidRoundsWithOffers } from "@/resources/bidRounds/bidRound.service";
import Paginator from "@/components/Paginator";
import { buildImgUrl } from "@/utils/media";
import { Link } from "@/i18n/routing";
import { Button } from "@/shadcn/ui/button";
import { useState } from "react";
import { listBidRequests } from "@/resources/bidRequests/bidRequest.service";
import { BidRequestExtendedT } from "@/resources/bidRequests/bidRequest.types";
import { useTranslations } from "next-intl";

export default function AdminOffersPage() {
  return (
    <Col>
      <p className="font-bold text-[18pt]">오퍼 관리</p>
      <AdminOffers />
    </Col>
  );
}

function AdminOffers() {
  const { listResponse, filters, setFilters } = useListData(
    listBidRoundsWithOffers, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <Row className="justify-center bg-gray p-4 rounded-sm">
      <p>현재 오퍼 중 작품이 없습니다</p>
    </Row>;
  }

  return <>
    <div className="flex flex-col">
      <div className="flex">
        <div className="w-[30%] p-2 flex justify-start font-bold text-gray-shade">작품명</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">작가명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">제안 오퍼</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">게시 종료일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade"></div>
      </div>
      {listResponse.items
        .map((item, i) => <TableRow key={i} bidRound={item} />)}
    </div>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;

}

function TableRow({ bidRound }:{
  bidRound: AdminPageBidRoundWithOffersT;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <Row className="w-full bg-white rounded-sm p-2 my-2 items-center">
        <Row className="w-[30%] p-2 flex gap-2">
          <Image
            src={buildImgUrl(bidRound.webtoon.thumbPath, { size: "xxs" } )}
            alt={`${bidRound.webtoon.thumbPath}`}
            style={{ objectFit: "cover" }}
            width={50}
            height={50}
          />
          <Link
            className="text-mint underline"
            href={`/webtoons/${bidRound.webtoon.id}`}>
            {bidRound.webtoon.title}
          </Link>
        </Row>
        <div className="w-[15%] p-2 flex justify-center">
          {bidRound.creatorUser.username}
        </div>
        <div className="w-[20%] p-2 flex justify-center">
          {`${bidRound.offerCount}개`}
        </div>
        <div className="w-[20%] p-2 flex justify-center">
          {/*TODO negotiation 기준이 맞나? */}
          {bidRound.negoStartsAt?.toLocaleDateString("ko") ?? "-"}
        </div>
        <div className="w-[15%] p-2 flex justify-center">
          <Button variant="default" onClick={() => setIsExpanded(!isExpanded)}>
            내역 보기
          </Button>
        </div>
      </Row>
      {isExpanded && <BidRequestList bidRoundId={bidRound.bidRoundId} />}
    </>
  );
}

function BidRequestList({ bidRoundId }: {
  bidRoundId: number;
}) {
  const { listResponse } = useListData(
    listBidRequests, {
      limit: 0,
      bidRoundId
    });

  if (!listResponse) {
    return <Spinner />;
  }

  return <Col className="w-full bg-white rounded-sm p-2 items-center">
    <Row className="w-full">
      <div className="w-[10%] p-2 flex justify-start font-bold text-gray-shade">바이어명</div>
      <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">오퍼 발송일</div>
      <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">현재 상태</div>
      <div className="w-[40%] p-2 flex justify-center font-bold text-gray-shade">희망 판권</div>
      <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade"></div>
    </Row>
    {listResponse.items
      .map((item) => <BidRequestListItem key={item.id} bidRequest={item} />)}
  </Col>;
}

function BidRequestListItem({ bidRequest }: {
  bidRequest: BidRequestExtendedT;
}) {
  const tBusinessFields = useTranslations("businessFields");
  const tCountries = useTranslations("countries");
  const priorityStatus = bidRequest.approvedAt
    ? "오퍼 승인"
    // : bidRequest.acceptedAt
    //   ? "오퍼 수락"
    //   : bidRequest.cancelledAt
    //     ? "오퍼 취소"
    : bidRequest.rejectedAt
      ? "오퍼 거절"
      : "진행 중";
  return (
    <Row className="w-full bg-white rounded-sm p-2 items-center">
      <div className="w-[10%] p-2 flex justify-start">{bidRequest.username}</div>
      <div className="w-[20%] p-2 flex justify-center">
        {bidRequest.createdAt.toLocaleDateString("ko")}
      </div>
      <div className="w-[15%] p-2 flex justify-center">{priorityStatus}</div>
      <div className="w-[40%] p-2 flex justify-center">
        {bidRequest.contractRange.map((item) =>
          item.businessField === "WEBTOONS"
            ? `${tBusinessFields(item.businessField)}(${tCountries(item.country)}), `
            : `2차(${tBusinessFields(item.businessField)}), `
        )}
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        {/*TODO 추가 페이지*/}
        {/*<Button variant="outline" asChild>*/}
        {/*  <Link href={`/offers/${item.roundId}/condition/${item.id}`}>*/}
        {/*    협상 보기*/}
        {/*  </Link>*/}
        {/*</Button>*/}
      </div>
    </Row>
  );
}