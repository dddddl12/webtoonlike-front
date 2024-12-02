"use client";

import Spinner from "@/components/ui/Spinner";
import { Heading2 } from "@/components/ui/common";
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
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";

export default function BidRoundPage() {
  const { reload, reloadKey } = useReload();
  return <div key={reloadKey}>
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
  </div>;
}

function ListSection({ title, noItemsMessage, approvalStatus, reload }: {
  title: string;
  noItemsMessage: string;
  approvalStatus: BidRoundApprovalStatus;
  reload: () => void;
}) {
  return <>
    <Heading2>{title}</Heading2>
    <ListSectionContent noItemsMessage={noItemsMessage} approvalStatus={approvalStatus}
      reload={reload}/>
  </>;
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
    <ListTable columns={[
      {
        label: "작품명",
        width: 2
      },
      {
        label: "노출 시작일",
        width: 1
      },
      {
        label: "선공개 종료일",
        width: 1
      },
      {
        label: "게시 종료일",
        width: 1
      },
      {
        label: "상태",
        width: 1
      },
      {
        label: "",
        width: 1
      }
    ]}>
      {listResponse.items.map((item) => <TableRow key={item.id} bidRound={item} reload={reload} />)}
    </ListTable>
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
    <ListRow>
      <ListCell>
        <WebtoonAvatar webtoon={bidRound.webtoon}/>
      </ListCell>
      <ListCell>
        {bidRound.adminSettings.bidStartsAt?.toLocaleDateString("ko") ?? "-"}
      </ListCell>
      <ListCell>
        {bidRound.adminSettings.negoStartsAt?.toLocaleDateString("ko") ?? "-"}
      </ListCell>
      <ListCell>
        {bidRound.adminSettings.processEndsAt?.toLocaleDateString("ko") ?? "-"}
      </ListCell>
      <ListCell>
        {t(bidRound.status)}
      </ListCell>
      <BidRoundAdminSettingsForm bidRoundId={bidRound.id}
        reload={reload}>
        <Button>수정</Button>
      </BidRoundAdminSettingsForm>
    </ListRow>
  );
}
