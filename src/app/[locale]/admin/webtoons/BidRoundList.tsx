import { Col, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { useListData } from "@/hooks/listData";
import Spinner from "@/components/Spinner";
import Paginator from "@/components/Paginator";
import { AdminPageBidRoundT, listBidRoundsWithWebtoon } from "@/resources/bidRounds/bidRound.service";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/bidRound.types";
import { Link } from "@/i18n/routing";


export default function BidRoundList() {

  const { listResponse, filters, setFilters } = useListData(
    listBidRoundsWithWebtoon, {
      page: 1,
      approvalStatus: BidRoundApprovalStatus.Approved
    });


  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <Row className="justify-center bg-gray p-4 rounded-sm">
      <Text>현재 관리할 수 있는 작품이 없습니다</Text>
    </Row>;
  }

  return (
    <Col>
      <div className="flex flex-col">
        <div className="flex p-2">
          <div className="w-[60%] p-2 font-bold text-gray-shade">작품명</div>
          <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">이름</div>
          <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">신청 날짜</div>
        </div>
        {listResponse.items.map((bidRound) => (
          <TableRow key={bidRound.id} bidRound={bidRound} />
        ))}
      </div>
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
    <div key={bidRound.id} className="flex bg-white rounded-sm p-2 my-2">
      <div className="w-[60%] p-2 flex justify-start">
        <Link
          className="text-mint underline"
          href={`/webtoons/${bidRound.webtoon.id}`}>
          {bidRound.webtoon.title}
        </Link>
      </div>
      <div className="w-[20%] p-2 flex justify-center">{bidRound.webtoon.username}</div>
      <div className="w-[20%] p-2 flex justify-center">
        {bidRound.createdAt.toLocaleString("ko")}
      </div>
    </div>
  );
}
