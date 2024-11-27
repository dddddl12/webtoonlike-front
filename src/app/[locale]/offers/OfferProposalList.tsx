import { useLocale, useTranslations } from "next-intl";
import { Col, Row } from "@/components/ui/common";
import {
  listOfferProposals
} from "@/resources/offers/controllers/offerProposal.controller";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useTokenInfo from "@/hooks/tokenInfo";
import { Skeleton } from "@/shadcn/ui/skeleton";
import useReload from "@/hooks/reload";
import { clsx } from "clsx";
import { OfferProposalListT } from "@/resources/offers/dtos/offerProposal.dto";
import ViewOfferProposalSection from "@/app/[locale]/offers/components/ViewOfferProposalSection";
import { OfferWithBuyerAndWebtoonT } from "@/resources/offers/dtos/offer.dto";
import ReloadOfferContext from "@/app/[locale]/offers/ReloadOfferContext";

// TODO 페이지네이션 없음
export default function OfferProposalList({ curOffer, setCurOffer }: {
  curOffer: OfferWithBuyerAndWebtoonT;
  setCurOffer: Dispatch<SetStateAction<OfferWithBuyerAndWebtoonT>>;
}) {
  const offerId = curOffer.id;
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const { reload, reloadKey } = useReload();
  const [offerProposalsResponse, setOfferProposalsResponse] = useState<OfferProposalListT>();

  useEffect(() => {
    listOfferProposals(offerId)
      .then(res => setOfferProposalsResponse(res?.data));
  }, [offerId, reloadKey]);

  if (!offerProposalsResponse) {
    return <div>
      <Skeleton className="w-full h-[40px] my-[20px]" />
      <Skeleton className="w-full h-[40px] my-[20px]" />
    </div>;
  }

  const { proposals, invoice } = offerProposalsResponse;

  return <ReloadOfferContext.Provider value={reload}>
    <Col className="rounded-md p-4 bg-gray-darker" ref={headingRef}>
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
    </Col>
  </ReloadOfferContext.Provider>;
}

function ProposalRow({ seq, createdAt, user, statusLabel, offerProposal }: {
  seq: number;
  createdAt: Date;
  user: {
    id: number;
    name: string;
  };
  statusLabel: string;
  offerProposal?: OfferProposalListT["proposals"][number];
}) {
  const [showDetails, setShowDetails] = useState(false);
  const tGeneral = useTranslations("general");
  const locale = useLocale();
  const { tokenInfo } = useTokenInfo();
  return <>
    <Row className={clsx({
      "bg-[#376C49] rounded-[10px]": showDetails
    })}>
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
    {showDetails && offerProposal && <Col className="mx-16">
      <ViewOfferProposalSection offerProposalId={offerProposal.id}/>
    </Col>}
  </>;
}
