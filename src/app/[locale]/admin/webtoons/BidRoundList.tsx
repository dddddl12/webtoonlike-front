import { Col } from "@/components/ui/common";
import useListData from "@/hooks/listData";
import Spinner from "@/components/ui/Spinner";
import Paginator from "@/components/ui/Paginator";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import { adminListBidRoundsWithWebtoon } from "@/resources/bidRounds/controllers/bidRoundAdmin.controller";
import { AdminPageBidRoundT } from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";


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
        <WebtoonAvatar webtoon={bidRound.webtoon}/>
      </div>
      <div className="w-[20%] p-2 flex justify-center">{bidRound.creator.user.name}</div>
      <div className="w-[20%] p-2 flex justify-center">
        {bidRound.createdAt.toLocaleString("ko")}
      </div>
    </div>
  );
}
