import { Col, Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { AdminPageBidRoundT, approveBidRound, declineBidRound } from "@/resources/bidRounds/bidRound.service";
import { buildImgUrl } from "@/utils/media";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function BidRoundDetail({
  bidRound, onHandleDetailReset
}: {
  bidRound: AdminPageBidRoundT;
  onHandleDetailReset: () => void;
}) {
  async function handleApprove() {
    await approveBidRound(bidRound.id);
    onHandleDetailReset();
  }

  async function handleDisapprove() {
    await declineBidRound(bidRound.id);
    onHandleDetailReset();
  }

  const { webtoon } = bidRound;

  return (
    <Col>
      <Row className="items-start">
        <Button onClick={onHandleDetailReset}>
          back
        </Button>
      </Row>

      <Col>
        <Row className="justify-between items-start">
          <div className="min-w-[150px] min-h-[150px] overflow-hidden relative rounded-sm mr-[30px]">
            <Image
              src={buildImgUrl(webtoon.thumbPath, { size: "md" })}
              alt={webtoon.thumbPath}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Col className="max-w-[80%]">
            <Link
              className="text-[16pt] text-mint underline cursor-pointer"
              href={`/webtoons/${webtoon.id}`}
            >
              제목: {webtoon.title}
            </Link>
            <p className="text-[12pt]">작가: {webtoon.username}</p>
            <p className="text-[12pt]">줄거리: {webtoon.description}</p>
          </Col>
        </Row>
      </Col>
      <Row className="gap-5 justify-center">
        <Button className="bg-mint" onClick={handleApprove}>승인</Button>
        <Button className="bg-red" onClick={handleDisapprove}>반려</Button>
      </Row>
    </Col>
  );
}
