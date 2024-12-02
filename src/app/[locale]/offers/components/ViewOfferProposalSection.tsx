import { useTranslations } from "next-intl";
import { Col, Heading2, HR } from "@/components/ui/common";
import { useEffect, useMemo, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import OfferProposalDetails from "@/components/shared/OfferProposalDetails";
import Profile from "@/components/shared/Profile";
import { getOfferProposalDetails } from "@/resources/offers/controllers/offerProposal.controller";
import { OfferProposalDetailsT, OfferProposalStatus } from "@/resources/offers/dtos/offerProposal.dto";
import Controls from "@/app/[locale]/offers/components/Controls";
import useTokenInfo from "@/hooks/tokenInfo";
import useSafeAction from "@/hooks/safeAction";

export default function ViewOfferProposalSection({ offerProposalId }: {
  offerProposalId: number;
}) {
  const { tokenInfo } = useTokenInfo();
  const [offerProposal, setOfferProposal] = useState<OfferProposalDetailsT>();

  const boundGetOfferProposalDetails = useMemo(() => getOfferProposalDetails.bind(null, offerProposalId), [offerProposalId]);
  const { execute } = useSafeAction(boundGetOfferProposalDetails, {
    onSuccess: ({ data }) => setOfferProposal(data)
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const tMakeAnOffer = useTranslations("offerDetails");
  if (!offerProposal) {
    return <Spinner />;
  }
  return <Col className="bg-box p-5 rounded-[10px]">
    <Heading2>{tMakeAnOffer("offerer")}</Heading2>
    <Profile creatorOrBuyer={offerProposal.sender}/>
    <HR />
    <OfferProposalDetails
      offerProposal={offerProposal}
    />
    {offerProposal.status === OfferProposalStatus.Pending
      // 수신자만 반응 가능
      && tokenInfo
      && offerProposal.sender.user.userType !== tokenInfo.metadata.type
      && <Controls offerProposal={offerProposal}/>}
  </Col>;
}
