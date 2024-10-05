"use client";

import { useListData } from "@/hooks/ListData";
import * as InvoiceApi from "@/apis/admins";
import * as BidRequestApi from "@/apis/bid_request";
import { useEffect, useState } from "react";
import { TableRow } from "@/ui/shadcn/Table";
import { Button } from "@/ui/shadcn/Button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { generateRandomString } from "@/utils/randomString";
import { Container, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Pagenator } from "@/ui/tools/Pagenator";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import Link from "next/link";
import { BidRequestT, ListBidRequestOptionT } from "@/types";
import { convertTimeAbsolute } from "@/utils/time";
import { enqueueSnackbar } from "notistack";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { IssuanceInvoiceSubmit } from "./IssuanceInvoiceSubmit";
import { useRouter } from "next/navigation";

export function IssuanceInvoice() {
  const router = useRouter();
  const { data: bidRequestList$, actions: bidRequestAct } = useListData({
    listFn: BidRequestApi.list
  });

  const { status: bidRequestStatus, data: bidRequestList } = bidRequestList$;

  const [page, setPage] = useState<number>(0);
  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = bidRequestList.length || 0;

  const bidRequestListOpt: ListBidRequestOptionT = {
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
    $webtoon: true,
    $creator: true,
    $buyer: true,
    $round: true,
    status: "accepted",
    // approved: "only"
  };

  useEffect(() => {
    bidRequestAct.load(bidRequestListOpt);
  }, []);

  if (bidRequestStatus == "idle" || bidRequestStatus == "loading") {
    return <Spinner />;
  }
  if (bidRequestStatus == "error") {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
    return (
      <div className="flex p-2">
        <div className="w-[30%] p-2 font-bold text-gray-shade">작품명</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">작가명</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">바이어명</div>
        <div className="w-[25%] p-2 flex justify-center font-bold text-gray-shade">신청일</div>
        <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">인보이스 발행</div>
      </div>
    );
  }

  function TableRow(bidRequest: BidRequestT) {
    return (
      <Row key={generateRandomString()} className="flex bg-white rounded-sm p-2 my-2">
        <Row className="w-[30%] p-2 flex justify-start">
          <div className="w-[50px] h-[50px] overflow-hidden relative rounded-sm">
            <Image
              src={bidRequest.webtoon?.thumbPath ? buildImgUrl(null, bidRequest.webtoon.thumbPath, { size: "xxs" } ) : "/img/webtoon_default_image_small.svg"}
              alt={`${bidRequest.webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={2} />
          <div
            className="text-mint underline cursor-pointer"
            onClick={() => {router.push(`/webtoons/${bidRequest.webtoon?.id}`);}}
          >
            {bidRequest.webtoon?.title}
          </div>
        </Row>
        <div className="w-[15%] p-2 flex justify-center">
          <Text className="text-mint underline cursor-pointer">{bidRequest.creator?.name}</Text>
        </div>
        <div className="w-[15%] p-2 flex justify-center">
          <Text className="text-mint underline cursor-pointer">{bidRequest.buyer?.name}</Text>
        </div>
        <div className="w-[25%] p-2 flex justify-center">
          <Text className=" cursor-pointer">{convertTimeAbsolute(bidRequest.createdAt)}</Text>
        </div>
        <div className="w-[15%] flex justify-center items-center">
          <IssuanceInvoiceSubmit requestId={bidRequest.id} />
        </div>
      </Row>
    );
  }

  function InvoiceTable(bidReqeustList: BidRequestT[]) {
    return (
      <div className="flex flex-col">
        <TableHeader />
        {bidReqeustList.map((bidRequest: BidRequestT) => (
          <TableRow key={generateRandomString()} {...bidRequest} />
        ))}
      </div>
    );
  }

  return (
    <Container className="p-0">
      <Text className="font-bold text-[18pt]">인보이스 발행</Text>
      <Gap y={4} />
      {bidRequestList.length > 0
        ? <>
          {InvoiceTable(bidRequestList)}
          <Pagenator
            page={page}
            numData={totalNumData}
            itemPerPage={itemPerPage}
            pageWindowLen={pageWindowLen}
            onPageChange={handlePageClick}
          />
        </>
        : (<Row className="justify-center bg-gray p-4 rounded-sm"><Text>현재 협상된 작품이 없습니다</Text></Row>)}
    </Container>
  );
}
