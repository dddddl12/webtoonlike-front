"use client";

import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import * as BidRoundsApi from "@/apis/bid_rounds";
import { BidRoundT } from "@/types";
import { Heading, Text } from "@/ui/texts";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { useRouter } from "@/i18n/routing";
import { useSnackbar } from "notistack";

type BidRoundDetailPropsT = {
  bidRound: BidRoundT;
  onHandleDetailReset: () => void;
};

export function BidRoundDetail({
  bidRound, onHandleDetailReset
}: BidRoundDetailPropsT) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  async function handleApprove() {
    try {
      const rsp = await BidRoundsApi.approve(bidRound.id);
      if (rsp) {
        onHandleDetailReset();
      }
    } catch (e){
      console.log(e);
      enqueueSnackbar("작품 승인이 완료되지 않았습니다.", { variant: "warning" });
    }
  }

  async function handleDisapprove() {
    try {
      const rejectReason = prompt("Please enter rejection reason");

      if (rejectReason == null) {
        return;
      }

      const rsp = await BidRoundsApi.disapprove(bidRound.id, rejectReason);
      if (rsp) {
        if (rsp) {
          onHandleDetailReset();
        }
      }
    } catch (e){
      console.log(e);
      enqueueSnackbar("작품 반려가 완료되지 않았습니다.", { variant: "warning" });
    }
  }


  return (
    <Col>
      <Gap y={10} />
      <Col>
        <Row className="justify-between items-start">
          <div className="min-w-[150px] min-h-[150px] overflow-hidden relative rounded-sm mr-[30px]">
            <Image
              src={bidRound.webtoon?.thumbPath ? buildImgUrl(null, bidRound.webtoon.thumbPath, { size: "md" } ) : "/img/webtoon_default_image_small.svg"}
              alt={`${bidRound.webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Col className="max-w-[80%]">
            <Text
              className="text-[16pt] text-mint underline cursor-pointer"
              onClick={() => { router.push(`/webtoons/${bidRound.webtoon?.id}`); }}
            >
              제목: {bidRound.webtoon?.title}
            </Text>
            <Text className="text-[12pt]">작가: {bidRound.user?.fullName}</Text>
            <Text className="text-[12pt]">줄거리: {bidRound.webtoon?.description}</Text>
          </Col>
        </Row>
      </Col>
      <Gap y={10} />
      <Row className=" justify-center">
        <Button className="bg-mint" onClick={handleApprove}>승인</Button>
        <Gap x={5} />
        <Button className="bg-red" onClick={handleDisapprove}>반려</Button>
      </Row>
    </Col>
  );
}
