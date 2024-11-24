"use client";

import Spinner from "@/components/ui/Spinner";
import { Col } from "@/components/ui/common";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import useListData from "@/hooks/listData";
import Paginator from "@/components/ui/Paginator";
import { useTranslations } from "next-intl";
import BidRoundAdminSettingsForm from "@/components/forms/admin/BidRoundAdminSettingsForm";
import { Button } from "@/shadcn/ui/button";
import useReload from "@/hooks/reload";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { adminListBidRoundsWithWebtoon } from "@/resources/bidRounds/controllers/bidRoundAdmin.controller";
import { AdminPageBidRoundT } from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import NoItems from "@/components/ui/NoItems";

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
    <p className="font-bold text-[18pt]">{title}</p>
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
    return <NoItems message={noItemsMessage}/>;
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
      <div className="w-[30%] p-2 flex justify-start">
        <WebtoonAvatar webtoon={bidRound.webtoon}/>
      </div>
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
