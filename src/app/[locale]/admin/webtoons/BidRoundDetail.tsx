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

      <Col className="mt-10">
        <Row className="items-start">
          <div className="min-w-[150px] min-h-[150px] overflow-hidden relative rounded-sm mr-[30px]">
            <Image
              src={buildImgUrl(webtoon.thumbPath, { size: "md" })}
              alt={webtoon.thumbPath}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Col className="max-w-[80%]">
            <p className="text-xl">제목: <Link
              className="clickable"
              href={`/webtoons/${webtoon.id}`}
            >{webtoon.localized.title}</Link></p>
            <p>작가: {creator.user.name}</p>
            <p>설명: {webtoon.localized.description}</p>
          </Col>
        </Row>
      </Col>
      <Row className="gap-5 justify-center mt-10">
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
