"use client";

import Spinner from "@/components/Spinner";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { Col, Row } from "@/shadcn/ui/layouts";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/bidRound.types";
import useListData from "@/hooks/listData";
import { adminListBidRoundsWithWebtoon, AdminPageBidRoundT } from "@/resources/bidRounds/bidRound.service";
import { Text } from "@/shadcn/ui/texts";
import Paginator from "@/components/Paginator";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import BidRoundAdminSettingsForm from "@/components/forms/admin/BidRoundAdminSettingsForm";
import { Button } from "@/shadcn/ui/button";
import useReload from "@/hooks/reload";

export default function BidRoundPage() {
  const { reload, reloadKey } = useReload();
  return <Col className="gap-20" key={reloadKey}>
    <ListSection
      title="대기 작품 관리"
      noItemsMessage="현재 대기 중 작품이 없습니다"
      approvalStatus={BidRoundApprovalStatus.Pending}
      reload={reload}
    />
    <ListSection
      title="투고 작품 관리"
      noItemsMessage="현재 오퍼 중 작품이 없습니다"
      approvalStatus={BidRoundApprovalStatus.Approved}
      reload={reload}
    />
  </Col>;
}

function ListSection({ title, noItemsMessage, approvalStatus, reload }: {
  title: string;
  noItemsMessage: string;
  approvalStatus: BidRoundApprovalStatus;
  reload: () => void;
}) {
  return <Col>
    <Text className="font-bold text-[18pt]">{title}</Text>
    <ListSectionContent noItemsMessage={noItemsMessage} approvalStatus={approvalStatus}
      reload={reload}/>
  </Col>;
}

function ListSectionContent({ noItemsMessage, approvalStatus, reload }: {
  approvalStatus: BidRoundApprovalStatus;
  noItemsMessage: string;
  reload: () => void;
}) {
  const { listResponse, filters, setFilters } = useListData(
    adminListBidRoundsWithWebtoon, {
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
      {listResponse.items.map((item) => <TableRow key={item.id} bidRound={item} reload={reload} />)}
    </div>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}

function TableRow({ bidRound, reload }: {
  bidRound: AdminPageBidRoundT;
  reload: () => void;
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
        {bidRound.adminSettings.bidStartsAt?.toLocaleDateString("ko") ?? "-"}
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        {bidRound.adminSettings.negoStartsAt?.toLocaleDateString("ko") ?? "-"}
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        {bidRound.adminSettings.processEndsAt?.toLocaleDateString("ko") ?? "-"}
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        {t(bidRound.status)}
      </div>
      <BidRoundAdminSettingsForm bidRoundId={bidRound.id}
        adminSettings={bidRound.adminSettings}
        reload={reload}>
        <Button>수정</Button>
      </BidRoundAdminSettingsForm>
    </div>
  );
}
