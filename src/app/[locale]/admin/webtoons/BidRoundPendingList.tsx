import useListData from "@/hooks/listData";
import { adminListBidRoundsWithWebtoon, AdminPageBidRoundT } from "@/resources/bidRounds/bidRound.controller";
import { BidRoundApprovalStatus } from "@/resources/bidRounds/bidRound.types";
import Spinner from "@/components/Spinner";
import { Col, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import Paginator from "@/components/Paginator";
import { Link } from "@/i18n/routing";
import { Button } from "@/shadcn/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

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
    return <Row className="justify-center bg-gray p-4 rounded-sm">
      <Text>현재 승인 요청 작품이 없습니다</Text>
    </Row>;
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
      <Link className="w-[30%] p-2 flex justify-start text-mint underline" href={`/webtoons/${bidRound.webtoon.id}`}>
        {bidRound.webtoon.title}
      </Link>
      <div className="w-[20%] p-2 flex justify-center">
        {bidRound.creator.user.name}
      </div>
      <div className="w-[20%] p-2 flex justify-center">
        {bidRound.createdAt.toLocaleString("ko")}
      </div>
      <div className="w-[20%] p-2 flex justify-center">{t(bidRound.status)}</div>
      <div className="w-[10%] flex justify-center items-center">
        <Button className="w-[30px] h-[30px] p-0 bg-mint" onClick={() => { onDetailClick(bidRound); }}>
          <Pencil1Icon />
        </Button>
      </div>
    </div>
  );
}
