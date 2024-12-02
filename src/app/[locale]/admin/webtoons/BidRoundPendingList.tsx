import useListData from "@/hooks/listData";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import Spinner from "@/components/ui/Spinner";
import { Col } from "@/components/ui/common";
import Paginator from "@/components/ui/Paginator";
import { Button } from "@/shadcn/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { AdminPageBidRoundT } from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import { adminListBidRoundsWithWebtoon } from "@/resources/bidRounds/controllers/bidRoundAdmin.controller";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";

export default function BidRoundPendingList({
  onDetailClick,
}: {
  onDetailClick: (bidRound: AdminPageBidRoundT) => void;
}) {

  const { listResponse, filters, setFilters } = useListData(
    adminListBidRoundsWithWebtoon, {
      page: 1,
      approvalStatus: BidRoundApprovalStatus.Pending
    });


  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <NoItems message="현재 승인 요청 작품이 없습니다"/>;
  }

  return (
    <Col>
      <ListTable columns={[
        {
          label: "작품명",
          width: 3
        },
        {
          label: "이름",
          width: 2
        },
        {
          label: "신청 날짜",
          width: 3
        },
        {
          label: "상태",
          width: 2
        },
        {
          label: "",
          width: 1
        }
      ]}>
        {listResponse.items.map((bidRound) => (
          <TableRow key={bidRound.id} bidRound={bidRound}
            onDetailClick={onDetailClick} />
        ))}
      </ListTable>
      <Paginator
        currentPage={filters.page}
        totalPages={listResponse.totalPages}
        setFilters={setFilters}
      />
    </Col>
  );
}

function TableRow({ bidRound, onDetailClick }: {
  bidRound: AdminPageBidRoundT;
  onDetailClick: (bidRound: AdminPageBidRoundT) => void;
}) {
  const t = useTranslations("bidRoundStatus");
  return (
    <ListRow>
      <ListCell>
        <WebtoonAvatar webtoon={bidRound.webtoon}/>
      </ListCell>
      <ListCell>
        {bidRound.creator.user.name}
      </ListCell>
      <ListCell>
        {bidRound.createdAt.toLocaleString("ko")}
      </ListCell>
      <ListCell>
        {t(bidRound.status)}
      </ListCell>
      <ListCell>
        <Button variant="mint" size="smallIcon"
          onClick={() => { onDetailClick(bidRound); }}>
          <Pencil1Icon />
        </Button>
      </ListCell>
    </ListRow>
  );
}
