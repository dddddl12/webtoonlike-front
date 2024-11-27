import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import OfferProposalList from "@/app/[locale]/offers/OfferProposalList";
import StatusBadge from "@/components/ui/StatusBadge";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { OfferWithBuyerAndWebtoonT } from "@/resources/offers/dtos/offer.dto";
import { OfferProposalStatus } from "@/resources/offers/dtos/offerProposal.dto";
import OfferDetailsContext, { ProposalsReloadReq } from "@/app/[locale]/offers/OfferDetailsContext";

// TODO 아코디언 적용
export default function OfferListRow({ offer }:{
  offer: OfferWithBuyerAndWebtoonT;
}) {
  const locale = useLocale();
  const [showProposals, setShowProposals] = useState<boolean>(false);
  const [status, setStatus] = useState<OfferProposalStatus>(
    offer.activeOfferProposal.status);
  const { reloadProposals, reloadReq } = useReloadProposals();
  const { webtoon } = offer;
  return (
    <OfferDetailsContext.Provider value={{
      changeStatus: setStatus,
      reloadProposals
    }}>
      <div className="flex p-2 mt-4 text-white rounded-md bg-black-texts items-center">
        <div className="w-[40%] p-2 flex justify-start items-center">
          <WebtoonAvatar webtoon={webtoon}/>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          {offer.createdAt.toLocaleString(locale)}
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <span className="clickable"
            onClick={() => setShowProposals(prev => !prev)}>협상 내역 보기</span>
        </div>

        <div className="w-[20%] p-2 flex justify-center">
          <OfferProposalStatusBadge status={status}/>
        </div>
      </div>
      {showProposals
        && <OfferProposalList offerId={offer.id} reloadReq={reloadReq}/>}
    </OfferDetailsContext.Provider>
  );
}

function OfferProposalStatusBadge({ status }:{
  status: OfferProposalStatus;
}) {
  const tOfferProposalStatus = useTranslations("offerProposalStatus");
  const content = tOfferProposalStatus(status);
  switch (status) {
    case OfferProposalStatus.Pending:
      return <StatusBadge variant="yellow" content={content} />;
    case OfferProposalStatus.Declined:
      return <StatusBadge variant="red" content={content} />;
    case OfferProposalStatus.Accepted:
      return <StatusBadge variant="mint" content={content} />;
    default:
      throw new Error(`${status} is not valid OfferProposalStatus`);
  }
}

function useReloadProposals() {
  const [reloadReq, setReloadProposalsReq] = useState<ProposalsReloadReq>();
  const reloadProposals = useCallback((req: ProposalsReloadReq) => {
    setReloadProposalsReq(req);
  }, []);
  return { reloadProposals, reloadReq };
}