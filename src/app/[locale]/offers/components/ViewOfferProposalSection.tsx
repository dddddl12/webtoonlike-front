import { useTranslations } from "next-intl";
import { Col } from "@/components/ui/common";
import { Heading } from "@/components/ui/common";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import OfferProposalDetails from "@/components/shared/OfferProposalDetails";
import Profile from "@/components/shared/Profile";
import { getOfferProposalDetails } from "@/resources/offers/controllers/offerProposal.controller";
import { OfferProposalDetailsT, OfferProposalStatus } from "@/resources/offers/dtos/offerProposal.dto";
import Controls from "@/app/[locale]/offers/components/Controls";
import useTokenInfo from "@/hooks/tokenInfo";

export default function ViewOfferProposalSection({ offerProposalId }: {
  offerProposalId: number;
}) {
  const { tokenInfo } = useTokenInfo();
  const [offerProposal, setOfferProposal] = useState<OfferProposalDetailsT>();

  useEffect(() => {
    getOfferProposalDetails(offerProposalId)
      .then(res => setOfferProposal(res?.data));
  }, [offerProposalId]);

  const tMakeAnOffer = useTranslations("offerDetails");
  if (!offerProposal) {
    return <Spinner />;
  }
  // todo invoice 쪽과 통일
  return <Col className="w-full my-2 [&_*]:border-foreground bg-[#403F3F] p-5 rounded-[10px]">
    <Col>
      <Heading>{tMakeAnOffer("offerer")}</Heading>
      <Profile creatorOrBuyer={offerProposal.sender} />
    </Col>
    <hr className="my-10" />
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
