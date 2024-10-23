"use client";

import React, { useEffect, useState } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { convertTimeAbsolute } from "@/utils/time";
import { useListData } from "@/hooks/ListData";
import { Pagenator } from "@/ui/tools/Pagenator";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useRouter } from "@/i18n/routing";


type BidRoundListProps = {
  onDetailClick: (bidRound: BidRoundT) => void;
}

export function BidRoundList({
  onDetailClick,
}: BidRoundListProps) {
  const router = useRouter();
  const { data: bidRounds$, actions: bidRoundsAct } = useListData({
    listFn: BidRoundsApi.list
  });

  const { status, data: bidRounds } = bidRounds$;

  const [page, setPage] = useState<number>(0);
  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = bidRounds.length || 0;

  const listOpt: ListBidRoundOptionT = {
    $webtoon: true,
    $user: true,
    // $numData: true,
    // offset: page * itemPerPage,
    // limit: itemPerPage,
  };

  useEffect(() => {
    bidRoundsAct.load(listOpt);
  }, []);


  function handleEditClick(bidRound: BidRoundT) {
    onDetailClick(bidRound);
  }

  if (status == "idle" || status == "loading") {
    return <Spinner />;
  }
  if (status == "error") {
    return <ErrorComponent />;
  }

  const bodyData = bidRounds.filter((item) => item.status !== "idle");

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
    return (
      <div className="flex p-2">
        <div className="w-[60%] p-2 font-bold text-gray-shade">작품명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">이름</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">신청 날짜</div>
      </div>
    );
  }

  function TableRow(bidRound: BidRoundT) {
    return (
      <div key={bidRound.id} className="flex bg-white rounded-sm p-2 my-2">
        <div className="w-[60%] p-2 flex justify-start">
          <div
            className="text-mint underline cursor-pointer"
            onClick={() => {router.push(`/webtoons/${bidRound.webtoon?.id}`);}}>
            {bidRound.webtoon?.title}
          </div>
        </div>
        <div className="w-[20%] p-2 flex justify-center">{bidRound.user?.fullName}</div>
        <div className="w-[20%] p-2 flex justify-center">{convertTimeAbsolute(bidRound.createdAt)}</div>
      </div>
    );
  }

  function BidRoundTable(bidRoundList: BidRoundT[]) {
    const startIndex = page * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    const paginatedWebtoons = bidRoundList.slice(startIndex, endIndex);
    return (
      <div className="flex flex-col">
        <TableHeader />
        {paginatedWebtoons.map((bidRound) => (
          <TableRow key={bidRound.id} {...bidRound} />
        ))}
      </div>
    );
  }

  return (
    <Col className="p-0">
      <Gap y={10} />
      <Text className="font-bold text-[18pt]">작품 관리</Text>
      <Gap y={5} />
      {bidRounds.length > 0 ? (
        <>
          {BidRoundTable(bidRounds)}
          <Pagenator
            page={page}
            numData={totalNumData}
            itemsPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
      ) : (
        <Row className="justify-center bg-gray p-4 rounded-sm">
          <Text>현재 관리할 수 있는 작품이 없습니다</Text>
        </Row>
      )}
    </Col>
  );
}

