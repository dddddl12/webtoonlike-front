import { Col, Row } from "@/components/ui/common";
import OfferProposalDetails from "@/components/shared/OfferProposalDetails";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import Profile from "@/components/shared/Profile";
import WebtoonDetails from "@/components/shared/WebtoonPageContents/WebtoonDetails";
import { OfferDetailsT } from "@/resources/offers/dtos/offerProposal.dto";
import { getOfferDetails } from "@/resources/offers/controllers/offerProposal.controller";

export default function OfferDetailsForInvoice({ offerProposalId }: {
  offerProposalId: number;
}) {
  const [offerProposal, setOfferProposal] = useState<OfferDetailsT>();
  useEffect(() => {
    getOfferDetails(offerProposalId)
      .then(res => setOfferProposal(res?.data));
  }, [offerProposalId]);

  if (!offerProposal) {
    return <Spinner/>;
  }

  return <Col className="gap-10 bg-[#403F3F] p-5 rounded-[10px] mb-2">
    <WebtoonDetails webtoon={offerProposal.webtoon} context="InvoiceView"/>
    <Row>
      <Profile creatorOrBuyer={offerProposal.creator} />
      <Profile creatorOrBuyer={offerProposal.buyer} />
    </Row>
    <hr className="border-gray-dark"/>
    <OfferProposalDetails
      offerProposal={offerProposal} />
  </Col>;
}
