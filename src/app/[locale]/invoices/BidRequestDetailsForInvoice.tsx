import { getBidRequest } from "@/resources/bidRequests/controllers/bidRequest.controller";
import { Col, Row } from "@/components/ui/common";
import OfferDetails from "@/components/shared/OfferDetails";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import Profile from "@/components/shared/Profile";
import { BidRequestDetailsT } from "@/resources/bidRequests/dtos/bidRequest.dto";
import WebtoonDetails from "@/components/shared/WebtoonPageContents/WebtoonDetails";

export default function BidRequestDetailsForInvoice({ bidRequestId }: {
  bidRequestId: number;
}) {
  const [bidRequest, setBidRequest] = useState<BidRequestDetailsT>();
  useEffect(() => {
    getBidRequest(bidRequestId)
      .then(res => setBidRequest(res?.data));
  }, [bidRequestId]);

  if (!bidRequest) {
    return <Spinner/>;
  }

  return <Col className="gap-10 bg-[#403F3F] p-5 rounded-[10px] mb-2">
    <WebtoonDetails webtoon={bidRequest.webtoon} context="InvoiceView"/>
    <Row>
      <CreatorProfile creator={bidRequest.creator} />
      <BuyerProfile buyer={bidRequest.buyer} />
    </Row>
    <hr className="border-gray-dark"/>
    <OfferDetails
      contractRange={bidRequest.contractRange}
      message={bidRequest.message} />
  </Col>;
}

function CreatorProfile({ creator }: {
  creator: BidRequestDetailsT["creator"];
}) {
  const affiliatedDisplay = creator.isAgencyAffiliated ? "에이전시 소속" : "개인";
  const { user } = creator;
  return <Profile
    name={user.name + "(판매자)"}
    title={[affiliatedDisplay, creator.localized.name].join(" / ")}
    thumbPath={user.thumbPath}
    phone={user.phone}
    email={user.email}
    className="flex-1"
  />;
}

function BuyerProfile({ buyer }: {
  buyer: BidRequestDetailsT["buyer"];
}) {
  const { user } = buyer;
  return <Profile
    name={user.name + "(구매자)"}
    title={[buyer.name, buyer.dept, buyer.position].join(" / ")}
    thumbPath={user.thumbPath}
    phone={user.phone}
    email={user.email}
    className="flex-1"
  />;
}
