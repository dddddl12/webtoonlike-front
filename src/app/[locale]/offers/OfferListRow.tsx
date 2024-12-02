import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import OfferProposalList from "@/app/[locale]/offers/OfferProposalList";
import StatusBadge from "@/components/ui/StatusBadge";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { OfferWithBuyerAndWebtoonT } from "@/resources/offers/dtos/offer.dto";
import { OfferProposalStatus } from "@/resources/offers/dtos/offerProposal.dto";
import OfferDetailsContext, { ProposalsReloadReq } from "@/app/[locale]/offers/OfferDetailsContext";
import { ListCell, ListRow, useListExpansionSwitch } from "@/components/ui/ListTable";

// TODO 아코디언 적용
export default function OfferListRow({ offer }:{
  offer: OfferWithBuyerAndWebtoonT;
}) {
  const locale = useLocale();
  const [status, setStatus] = useState<OfferProposalStatus>(
    offer.activeOfferProposal.status);
  const { reloadProposals, reloadReq } = useReloadProposals();
  const { webtoon } = offer;
  const { switchButton, ListRowExpanded } = useListExpansionSwitch();
  return (
    <OfferDetailsContext.Provider value={{
      changeStatus: setStatus,
      reloadProposals
    }}>
      <ListRow>
        <ListCell>
          <WebtoonAvatar webtoon={webtoon}/>
        </ListCell>

        <ListCell>
          {offer.createdAt.toLocaleString(locale)}
        </ListCell>

        <ListCell>
          {switchButton}
        </ListCell>

        <ListCell>
          <OfferProposalStatusBadge status={status}/>
        </ListCell>
      </ListRow>

      <ListRowExpanded>
        <OfferProposalList offerId={offer.id} reloadReq={reloadReq}/>
      </ListRowExpanded>
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