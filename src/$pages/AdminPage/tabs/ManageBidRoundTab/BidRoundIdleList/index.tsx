"use client";

import React, { useEffect, useState } from "react";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Text } from "@/ui/texts";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { convertTimeAbsolute } from "@/utils/time";
import { useRouter } from "@/i18n/routing";
import { useListData } from "@/hooks/ListData";
import { convertBidRoundStatus } from "@/utils/bidRoundStatusConverter";
import { Pagenator } from "@/ui/tools/Pagenator";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";

type BidRoundListProps = {
  onDetailClick: (bidRound: BidRoundT) => void;
}

export function BidRoundIdleList({
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
  const totalNumData = bidRounds.filter((item) => item.status === "idle").length || 0;

  const listOpt: ListBidRoundOptionT = {
    $webtoon: true,
    $user: true,
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
    approval: "exceptDisapproved",
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

  const bodyData = bidRounds.filter((item) => item.status === "idle");

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
    return (
      <div className="flex p-2">
        <div className="w-[30%] p-2 font-bold text-gray-shade">작품명</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">이름</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">신청 날짜</div>
        <div className="w-[20%] p-2 flex justify-center font-bold text-gray-shade">상태</div>
        <div className="w-[10%] p-2 flex justify-end font-bold text-gray-shade"></div>
      </div>
    );
  }

  function TableRow(bidRound: BidRoundT) {
    return (
      <div key={bidRound.id} className="flex bg-white rounded-sm p-2 my-2">
        <div className="w-[30%] p-2 flex justify-start text-mint underline cursor-pointer" onClick={() => {router.push(`/webtoons/${bidRound.webtoon?.id}`);}}>{bidRound.webtoon?.title}</div>
        <div className="w-[20%] p-2 flex justify-center">{bidRound.user?.fullName}</div>
        <div className="w-[20%] p-2 flex justify-center">{convertTimeAbsolute(bidRound.createdAt)}</div>
        <div className="w-[20%] p-2 flex justify-center">{convertBidRoundStatus(bidRound.status)}</div>
        <div className="w-[10%] flex justify-center items-center">
          <Button className="w-[30px] h-[30px] p-0 bg-mint" onClick={() => { handleEditClick(bidRound); }}>
            <Pencil1Icon />
          </Button>
          <Gap x={1} />
          {/* <Button className="w-[30px] h-[30px] p-0 bg-red" onClick={handleDeleteClick}>
            <IconClose className="fill-white"/>
          </Button> */}
        </div>
      </div>
    );
  }

  function BidRoundTable(bidRoundList: BidRoundT[]) {
    return (
      <Col>
        <TableHeader />
        {bidRoundList.map((bidRound) => (
          <TableRow key={bidRound.id} {...bidRound} />
        ))}
      </Col>
    );
  }

  return (
    <Container className="p-0">
      <Text className="font-bold text-[18pt]">작품 승인</Text>
      <Gap y={4} />
      {bodyData.length > 0
        ? <>
          {BidRoundTable(bodyData)}
          <Pagenator
            page={page}
            numData={totalNumData}
            itemsPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
        : <Row className="justify-center bg-gray p-4 rounded-sm"><Text>현재 승인 요청 작품이 없습니다</Text></Row>}
    </Container>
  );
}