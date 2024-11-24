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
      <div className="flex p-2">
        <div className="w-[30%] p-2 font-bold text-gray-shade">작품명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">이름</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">신청 날짜</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">상태</div>
        <div className="w-[10%] p-2 flex justify-end font-bold text-gray-shade"></div>
      </div>
      {listResponse.items.map((bidRound) => (
        <TableRow key={bidRound.id} bidRound={bidRound} onDetailClick={onDetailClick} />
      ))}
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
    <div key={bidRound.id} className="flex bg-white rounded-sm p-2 my-2">
      <div className="w-[30%] p-2 flex justify-start">
        <WebtoonAvatar webtoon={bidRound.webtoon}/>
      </div>
      <div className="w-[20%] p-2 flex justify-center">
        {bidRound.creator.user.name}
      </div>
      <div className="w-[20%] p-2 flex justify-center">
        {bidRound.createdAt.toLocaleString("ko")}
      </div>
      <div className="w-[20%] p-2 flex justify-center">{t(bidRound.status)}</div>
      <div className="w-[10%] flex justify-center items-center">
        <Button className="w-[30px] h-[30px] p-0 bg-mint"
          onClick={() => { onDetailClick(bidRound); }}>
          <Pencil1Icon />
        </Button>
      </div>
    </div>
  );
}
