import { useLocale, useTranslations } from "next-intl";
import { Col, Row } from "@/components/ui/common";
import {
  listOfferProposals
} from "@/resources/offers/controllers/offerProposal.controller";
import { useEffect, useMemo, useRef, useState } from "react";
import useTokenInfo from "@/hooks/tokenInfo";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { clsx } from "clsx";
import { OfferProposalListT } from "@/resources/offers/dtos/offerProposal.dto";
import ViewOfferProposalSection from "@/app/[locale]/offers/components/ViewOfferProposalSection";
import { ProposalsReloadReq } from "@/app/[locale]/offers/OfferDetailsContext";
import useSafeAction from "@/hooks/safeAction";

// TODO 페이지네이션 없음
export default function OfferProposalList({ offerId, reloadReq }: {
  offerId: number;
  reloadReq?: ProposalsReloadReq;
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const [offerProposalsResponse, setOfferProposalsResponse] = useState<OfferProposalListT>();

  const boundSetOfferProposalsResponse = useMemo(() => listOfferProposals.bind(null, offerId), [offerId]);
  const { execute } = useSafeAction(boundSetOfferProposalsResponse, {
    onSuccess: ({ data }) => {
      setOfferProposalsResponse(data);
      if (reloadReq?.refocusToLast) {
        // 접기 등 상태 재조정
        setReloadKey(prev => prev + 1);
      }
    }
  });

  useEffect(() => {
    execute();
  }, [execute]);

  if (!offerProposalsResponse) {
    return <div>
      <Skeleton className="w-full h-[40px] my-[20px]" />
      <Skeleton className="w-full h-[40px] my-[20px]" />
    </div>;
  }

  const { proposals, invoice } = offerProposalsResponse;

  return <Col className="rounded-md p-4 bg-gray-darker" key={reloadKey}>
    <Row className="border-b border-gray-text text-gray-text">
      <div className="w-[20%] p-2 flex justify-center">No.</div>
      <div className="w-[20%] p-2 flex justify-center">일자</div>
      <div className="w-[20%] p-2 flex justify-center">보낸 사람</div>
      <div className="w-[20%] p-2 flex justify-center">협의 내용</div>
      <div className="w-[20%] p-2 flex justify-center">현황</div>
    </Row>

    {proposals.map((proposal, index) => (
      <ProposalRow
        key={index}
        seq={index}
        user={proposal.user}
        createdAt={proposal.createdAt}
        statusLabel={index === 0 ? "제안" : "수정 요청"}
        offerProposal={proposal}
        defaultOpen={reloadReq?.refocusToLast && index === proposals.length - 1}
      />
    ))}
    {!!invoice
    && <ProposalRow
      seq={proposals.length}
      user={{
        id: -1,
        name: "관리자"
      }}
      createdAt={invoice.createdAt}
      statusLabel={"인보이스 발생"}>
    </ProposalRow>}
  </Col>;
}

function ProposalRow({ seq, createdAt, user, statusLabel, defaultOpen, offerProposal }: {
  seq: number;
  createdAt: Date;
  user: {
    id: number;
    name: string;
  };
  statusLabel: string;
  defaultOpen?: boolean;
  offerProposal?: OfferProposalListT["proposals"][number];
}) {
  const [showDetails, setShowDetails] = useState(defaultOpen ?? false);
  const tGeneral = useTranslations("general");
  const locale = useLocale();
  const { tokenInfo } = useTokenInfo();

  const lastProposalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (defaultOpen) {
      lastProposalRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [defaultOpen]);
  return <>
    <Row className={clsx({
      "bg-[#376C49] rounded-[10px]": showDetails
    })} ref={lastProposalRef}>
      <div className="w-[20%] p-2 flex justify-center">{seq + 1}</div>
      <div className="w-[20%] p-2 flex justify-center">{createdAt.toLocaleString(locale)}</div>
      <div className="w-[20%] p-2 flex justify-center">
        {tokenInfo?.userId === user.id ? "나" : user.name}
      </div>
      <div className="w-[20%] p-2 flex justify-center">
        {offerProposal
          && <div className="clickable"
            onClick={() => setShowDetails(prev => !prev)}>
            {showDetails ? tGeneral("collapse") : tGeneral("expand")}
          </div>}
      </div>
      <div className="w-[20%] p-2 flex justify-center">{statusLabel}</div>
    </Row>
    {showDetails && offerProposal && <Col>
      <ViewOfferProposalSection offerProposalId={offerProposal.id}/>
    </Col>}
  </>;
}
