import { Col, Row } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import { buildImgUrl } from "@/utils/media";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useMemo } from "react";
import useSafeAction from "@/hooks/safeAction";
import { AdminPageBidRoundT } from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import { approveOrDisapproveBidRound } from "@/resources/bidRounds/controllers/bidRoundAdmin.controller";

export default function BidRoundDetail({
  bidRound, onHandleDetailReset
}: {
  bidRound: AdminPageBidRoundT;
  onHandleDetailReset: () => void;
}) {
  const boundApproveOrDisapproveBidRound = useMemo(() => approveOrDisapproveBidRound
    .bind(null, bidRound.id), [bidRound.id]);
  const { execute } = useSafeAction(boundApproveOrDisapproveBidRound, {
    onSuccess: onHandleDetailReset
  });

  function handleApprove() {
    execute({ action: "approve" });
  }
  function handleDisapprove() {
    execute({ action: "disapprove" });
  }

  const { webtoon, creator } = bidRound;

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
              className="text-[16pt] clickable"
              href={`/webtoons/${webtoon.id}`}
            >
              제목: {webtoon.localized.title}
            </Link>
            <p className="text-[12pt]">작가: {creator.user.name}</p>
            <p className="text-[12pt]">줄거리: {webtoon.localized.description}</p>
          </Col>
        </Row>
      </Col>
      <Row className="gap-5 justify-center">
        <Button variant="mint" onClick={handleApprove}>
          승인
        </Button>
        <Button variant="red" onClick={handleDisapprove}>
          반려
        </Button>
      </Row>
    </Col>
  );
}
