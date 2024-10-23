"use client";

import { useEffect, useState } from "react";
import { useListData } from "@/hooks/ListData";
import Spinner from "@/components/Spinner";
import { Container, Gap, Row } from "@/ui/layouts";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { convertTimeAbsolute } from "@/utils/time";
import { Text } from "@/ui/texts";
import { Paginator } from "@/ui/tools/Paginator";
import { Button } from "@/ui/shadcn/Button";
import { SubmitEditWrapper } from "./SubmitEditWrapper";
import { convertBidRoundStatus } from "@/utils/bidRoundStatusConverter";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useRouter } from "@/i18n/routing";

export function ManageSubmitTab() {
  const router = useRouter();
  const { data: bidRounds$, actions: bidRoundsAct } = useListData({
    listFn: async (listOpt) => {
      return await BidRoundApi.list(listOpt);
    }
  });
  const { data: waitBidRounds$, actions: waitBidRoundsAct } = useListData({
    listFn: async (listOpt) => {
      return await BidRoundApi.list(listOpt);
    }
  });

  const { status: status, data: bidRounds } = bidRounds$;
  const { status: waitStatus, data: waitBidRounds } = waitBidRounds$;

  const [page, setPage] = useState<number>(0);
  const [waitPage, setwaitPage] = useState<number>(0);
  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = bidRounds$.numData || 0;
  const waitTotalNumData = waitBidRounds$.numData || 0;

  const listOpt: ListBidRoundOptionT = {
    $webtoon: true,
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
    status: "bidding,negotiating,done"
  };
  const waitListOpt: ListBidRoundOptionT = {
    $webtoon: true,
    $numData: true,
    offset: waitPage * itemPerPage,
    limit: itemPerPage,
    status: "idle,waiting"
  };

  useEffect(() => {
    bidRoundsAct.load(listOpt);
    waitBidRoundsAct.load(waitListOpt);
  }, [page, waitPage]);

  if (status == "idle" || status == "loading" || waitStatus == "idle" || waitStatus == "loading") {
    return <Spinner />;
  }
  if (status == "error" || waitStatus == "error") {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function handleWaitPageClick(page: number) {
    setwaitPage(page);
  }

  function handleEditSuccess(param: any) {
    try {
      bidRoundsAct.replaceItem(param);
      window.location.reload();
    } catch (e){
      console.warn(e);
    }
  }

  function TableHeader() {
    return (
      <div className="flex ">
        <div className="w-[30%] p-2 flex justify-start font-bold text-gray-shade">작품명</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">노출 시작일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">게시 종료일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">게시 종료일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">상태</div>
        <div></div>
      </div>
    );
  }

  function TableRow(bidRound: BidRoundT) {
    return (
      <div key={bidRound.id} className="flex bg-white rounded-sm p-2 my-2 items-center">
        <Row className="w-[30%] p-2 flex justify-start">
          <div className="min-w-[50px] min-h-[50px] overflow-hidden relative rounded-sm">
            <Image
              src={bidRound.webtoon?.thumbPath ? buildImgUrl(null, bidRound.webtoon.thumbPath, { size: "xxs" } ) : "/img/webtoon_default_image_small.svg"}
              alt={`${bidRound.webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={2} />
          <div
            className="text-mint underline max-w-[70%] cursor-pointer"
            onClick={() => {router.push(`/webtoons/${bidRound.webtoon?.id}`);}}>
            {bidRound.webtoon?.title}
          </div>
        </Row>
        <div className="w-[15%] p-2 flex justify-center">{bidRound.bidStartAt ? convertTimeAbsolute(bidRound.bidStartAt) : "-"}</div>
        <div className="w-[15%] p-2 flex justify-center">{bidRound.negoStartAt ? convertTimeAbsolute(bidRound.negoStartAt) : "-"}</div>
        <div className="w-[15%] p-2 flex justify-center">{bidRound.processEndAt ? convertTimeAbsolute(bidRound.processEndAt) : "-"}</div>
        <div className="w-[15%] p-2 flex justify-center">{convertBidRoundStatus(bidRound.status)}</div>
        <SubmitEditWrapper bidRound={bidRound} onEditSuccess={handleEditSuccess}>
          <Button>
            edit
          </Button>
        </SubmitEditWrapper>

      </div>
    );
  }

  function BidRoundTable(bidRounds: BidRoundT[]) {
    return (
      <div className="flex flex-col">
        <TableHeader />
        {bidRounds.map((item) => <TableRow key={item.id} {...item} />)}
      </div>
    );
  }

  return (
    <Container className="p-0">
      <Text className="font-bold text-[18pt]">대기 작품 관리</Text>
      <Gap y={5} />
      {waitBidRounds.length > 0 ? (
        <>
          {BidRoundTable(waitBidRounds)}
          <Paginator
            currentPage={waitPage}
            numData={waitTotalNumData}
            itemsPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handleWaitPageClick}
          />
        </>
      ) : (
        <Row className="justify-center bg-gray p-4 rounded-sm">
          <Text>현재 대기 중 작품이 없습니다</Text>
        </Row>
      )}
      <Gap y={10} />
      <Text className="font-bold text-[18pt]">투고 작품 관리</Text>
      <Gap y={5} />
      {bidRounds.length > 0 ? (
        <>
          {BidRoundTable(bidRounds)}
          <Paginator
            currentPage={page}
            numData={totalNumData}
            itemsPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
      ) : (
        <Row className="justify-center bg-gray p-4 rounded-sm">
          <Text>현재 오퍼 중 작품이 없습니다</Text>
        </Row>
      )}
      <Gap y={60} />
    </Container>
  );
}
