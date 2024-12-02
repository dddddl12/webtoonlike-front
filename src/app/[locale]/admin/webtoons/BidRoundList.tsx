import { Col } from "@/components/ui/common";
import useListData from "@/hooks/listData";
import Spinner from "@/components/ui/Spinner";
import Paginator from "@/components/ui/Paginator";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import { adminListBidRoundsWithWebtoon } from "@/resources/bidRounds/controllers/bidRoundAdmin.controller";
import { AdminPageBidRoundT } from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";


export default function BidRoundList() {

  const { listResponse, filters, setFilters } = useListData(
    adminListBidRoundsWithWebtoon, {
      page: 1,
      approvalStatus: BidRoundApprovalStatus.Approved
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <NoItems message="현재 관리할 수 있는 작품이 없습니다"/>;
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
          width: 1
        },
        {
          label: "신청 날짜",
          width: 2
        }
      ]}>
        {listResponse.items.map((bidRound) => (
          <TableRow key={bidRound.id} bidRound={bidRound} />
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

function TableRow({ bidRound }:{
  bidRound: AdminPageBidRoundT;
}) {
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
    </ListRow>
  );
}
