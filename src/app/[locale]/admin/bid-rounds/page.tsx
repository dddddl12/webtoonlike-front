"use client";

import Spinner from "@/components/Spinner";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { Col, Row } from "@/shadcn/ui/layouts";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/bidRound.types";
import { useListData } from "@/hooks/listData";
import { AdminPageBidRoundT, listBidRoundsWithWebtoon } from "@/resources/bidRounds/bidRound.service";
import { Text } from "@/shadcn/ui/texts";
import Paginator from "@/components/Paginator";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import SubmitEditWrapper from "@/app/[locale]/admin/bid-rounds/SubmitEditWrapper";

export default function BidRoundPage() {
  return <Col className="gap-20">
    <ListSection
      title="대기 작품 관리"
      noItemsMessage="현재 대기 중 작품이 없습니다"
      approvalStatus={BidRoundApprovalStatus.Pending}
    />
    <ListSection
      title="투고 작품 관리"
      noItemsMessage="현재 오퍼 중 작품이 없습니다"
      approvalStatus={BidRoundApprovalStatus.Approved}
    />
  </Col>;
}

function ListSection({ title, noItemsMessage, approvalStatus }: {
  title: string;
  noItemsMessage: string;
  approvalStatus: BidRoundApprovalStatus;
}) {
  return <Col>
    <Text className="font-bold text-[18pt]">{title}</Text>
    <ListSectionContent noItemsMessage={noItemsMessage} approvalStatus={approvalStatus} />
  </Col>;
}

function ListSectionContent({ noItemsMessage, approvalStatus }: {
  approvalStatus: BidRoundApprovalStatus;
  noItemsMessage: string;
}) {
  const { listResponse, filters, setFilters } = useListData(
    listBidRoundsWithWebtoon, {
      page: 1,
      approvalStatus
    });


  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <Row className="justify-center bg-gray p-4 rounded-sm">
      <Text>{noItemsMessage}</Text>
    </Row>;
  }

  return <>
    <div className="flex flex-col">
      <div className="flex ">
        <div className="w-[30%] p-2 flex justify-start font-bold text-gray-shade">작품명</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">노출 시작일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">게시 종료일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">게시 종료일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">상태</div>
        <div></div>
      </div>
      {listResponse.items.map((item) => <TableRow key={item.id} bidRound={item} />)}
    </div>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}

function TableRow({ bidRound }: {
  bidRound: AdminPageBidRoundT;
}) {
  const t = useTranslations("bidRoundStatus");
  return (
    <div key={bidRound.id} className="flex bg-white rounded-sm p-2 my-2 items-center">
      <Row className="w-[30%] p-2 gap-2">
        <div className="min-w-[50px] min-h-[50px] overflow-hidden relative rounded-sm">
          <Image
            src={buildImgUrl(bidRound.webtoon.thumbPath, { size: "xxs" } )}
            alt={`${bidRound.webtoon.thumbPath}`}
            style={{ objectFit: "cover" }}
            fill
          />
        </div>
        <Link
          className="text-mint underline max-w-[70%]"
          href={`/webtoons/${bidRound.webtoon.id}`}>
          {bidRound.webtoon.title}
        </Link>
      </Row>
      <div className="w-[15%] p-2 flex justify-center">
        {bidRound.bidStartsAt?.toLocaleDateString("ko") ?? "-"}
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        {bidRound.negoStartsAt?.toLocaleDateString("ko") ?? "-"}
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        {bidRound.processEndsAt?.toLocaleDateString("ko") ?? "-"}
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        {t(bidRound.status)}
      </div>
      <SubmitEditWrapper bidRound={bidRound} />
    </div>
  );
}
