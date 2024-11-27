import { createContext } from "react";
import { OfferProposalStatus } from "@/resources/offers/dtos/offerProposal.dto";

export type ProposalsReloadReq = {
  refocusToLast: boolean;
};

type OfferDetailsContextProps = {
  changeStatus: (status: OfferProposalStatus) => void;
  reloadProposals: (req: ProposalsReloadReq) => void;
};

const OfferDetailsContext = createContext<OfferDetailsContextProps>({
  changeStatus: () => {},
  reloadProposals: () => {}
});
export default OfferDetailsContext;
