"use client";

import { useListData } from "@/hooks/listData";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { Heading, Text } from "@/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as BidRequestsApi from "@/apis/bid_request";
import { BidRequestT, BidRoundT, ListBidRequestOptionT } from "@/types";
import { Pagenator } from "@/ui/tools/Pagenator";
import { nationConverter, nationConverterToKr } from "@/utils/nationConverter";
import { businessFieldConverterToEn, businessFieldConverterToKr } from "@/utils/businessFieldConverter";
import { convertBidRequestStatus, convertBidRequestStatusEn } from "@/utils/bidRequestStatusConverter";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function CreatorBidRequestDetailPage({ bidRound }: { bidRound: BidRoundT }) {
  const router = useRouter();
  const locale = useLocale();
  const { data: bidReqeusts$, actions: bidRequestsAct } = useListData({
    listFn: async (listOpt) => {
      return await BidRequestsApi.list(listOpt);
    },
  });

  const { status: bidRequestsStatus, data: bidRequests } = bidReqeusts$;

  const [page, setPage] = useState<number>(0);
  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = bidRequests.length || 0;

  const bidRequestListOpt: ListBidRequestOptionT = {
    $round: true,
    $buyer: true,
    roundId: bidRound.id,
  };

  useEffect(() => {
    bidRequestsAct.load(bidRequestListOpt);
  }, []);

  if (bidRequestsStatus == "idle" || bidRequestsStatus == "loading") {
    return <Spinner />;
  }

  if (bidRequestsStatus == "error") {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
    return (
      <div className="flex p-2 text-white">
        <div className="w-[30%] p-2 flex justify-start text-gray-shade">
          {locale === "ko" ? "바이어명" : "Buyer"}
        </div>
        <div className="w-[20%] p-2 flex justify-center text-gray-shade">
          {locale === "ko"
            ? "콘텐츠 서비스 - 웹툰"
            : "Content Service - Webtoon"}
        </div>
        <div className="w-[20%] p-2 flex justify-center text-gray-shade">
          {locale === "ko" ? "2차 사업권" : "Secondary Business Right"}
        </div>
        <div className="w-[15%] p-2 flex justify-center text-gray-shade">
          {locale === "ko" ? "오퍼 상태" : "Offer Status"}
        </div>
        <div className="w-[15%] p-2 flex justify-center text-gray-shade">
          {locale === "ko" ? "제안 조건" : "Offer Condition"}
        </div>
      </div>
    );
  }

  function TableRow(bidRequests: BidRequestT) {
    return (
      <div className="flex p-2 mb-2 text-white rounded-md bg-gray-darker items-center">
        <div className="w-[30%] p-2 flex justify-start items-center">
          <div className="w-[40px] h-[40px] overflow-hidden relative rounded-sm">
            <Image
              src={
                bidRequests.buyer?.company.thumbPath
                  ? buildImgUrl(null, bidRequests.buyer.company.thumbPath, {
                    size: "xxs",
                  })
                  : "/img/webtoon_default_image_small.svg"
              }
              alt={`${bidRequests.buyer?.company.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={4} />
          {bidRequests.buyer?.company.name} / {bidRequests.buyer?.name}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequests.contractRange.data[0].country
            ? locale === "en"
              ? nationConverter(bidRequests.contractRange.data[0].country)
              : nationConverterToKr(bidRequests.contractRange.data[0].country)
            : "-"}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {bidRequests.contractRange.data[0].businessField
            ? locale === "en"
              ? businessFieldConverterToEn(
                bidRequests.contractRange.data[0].businessField
              )
              : businessFieldConverterToKr(
                bidRequests.contractRange.data[0].businessField
              )
            : "-"}
        </div>

        <div className="w-[15%] p-2 flex justify-center">
          {locale === "ko"
            ? convertBidRequestStatus(bidRound.status)
            : convertBidRequestStatusEn(bidRound.status)}
        </div>

        <div className="w-[15%] p-2 flex justify-center">
          <Text
            className="text-mint underline cursor-pointer"
            onClick={() => {
              router.push(
                `/creator/bid-requests/${bidRound.id}/condition/${bidRequests.id}`
              );
            }}
          >
            {locale === "ko" ? "제안 조건 확인" : "Check Offer Condition"}
          </Text>
        </div>
      </div>
    );
  }

  function BidRequestTable(bidRequests: BidRequestT[]) {
    const startIndex = page * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    const paginatedWebtoons = bidRequests.slice(startIndex, endIndex);
    return (
      <Col>
        <TableHeader />
        {paginatedWebtoons.map((bidRequest) => (
          <TableRow key={bidRequest.id} {...bidRequest} />
        ))}
      </Col>
    );
  }

  return (
    <Container>
      <Col>
        <Gap y={20} />
        <Row className="bg-gray-darker rounded-sm p-[12px] justify-between">
          <div className="w-[115px] h-[175px] overflow-hidden relative rounded-sm">
            <Image
              src={ buildImgUrl(null, bidRound.webtoon.thumbPath, { size: "sm" })}
              alt={bidRound.webtoon.thumbPath}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Col className=" justify-between w-[86%]">
            <Row className="justify-between" onClick={() => {router.push(`/webtoons/${bidRound.webtoon?.id}`);}}>
              <Text className="font-bold text-[20pt] text-mint underline pr-5 cursor-pointer">{locale === "ko" ? bidRound.webtoon?.title : bidRound.webtoon?.title_en ?? bidRound.webtoon?.title}</Text>
              <div
                className="text-mint underline cursor-pointer"
                onClick={() => {router.push(`/webtoons/${bidRound.webtoon?.id}`);}}>
                {locale === "ko" ? "작품 상세보기" : "Details"}
              </div>
            </Row>
            <Gap y={2} />
            <Text className="text-white font-bold text-[16pt]">{bidRound.user?.fullName}</Text>
            <Gap y={2} />
            <Text className="text-white">{locale === "ko" ? bidRound.webtoon?.description : bidRound.webtoon?.description_en ?? bidRound.webtoon?.description}</Text>
            <Gap y={2} />
          </Col>
        </Row>

        <Gap y={20} />

        <Col>
          <Heading className="text-white font-bold text-[20pt]">
            {locale === "ko" ? "받은 오퍼" : "Offers"}</Heading>
        </Col>
        {BidRequestTable(bidRequests)}
        <Pagenator
          page={page}
          numData={totalNumData}
          itemPerPage={itemPerPage}
          pageWindowLen={pageWindowLen}
          onPageChange={handlePageClick}
        />
        <Gap y={40} />
      </Col>
    </Container>
  );
}
