import { useTranslations } from "next-intl";
import { Col } from "@/shadcn/ui/layouts";
import { Heading } from "@/shadcn/ui/texts";
import { getPublicBuyerInfoByUserId } from "@/resources/buyers/buyer.service";
import { useEffect, useState } from "react";
import { PublicBuyerInfoT } from "@/resources/buyers/buyer.types";
import Spinner from "@/components/Spinner";
import OfferDetails from "@/components/Details/OfferDetails";
import Profile from "@/components/Details/Profile";
import { SimpleBidRequestT } from "@/resources/bidRequests/bidRequest.service";

export default function ViewOfferSection({ bidRequest }: {
  bidRequest: SimpleBidRequestT;
}) {
  const [buyer, setBuyer] = useState<PublicBuyerInfoT>();
  const buyerUserId = bidRequest.buyer.user.id;

  useEffect(() => {
    getPublicBuyerInfoByUserId(buyerUserId)
      .then(setBuyer);
  }, [buyerUserId]);

  if (!buyer) {
    return <Spinner />;
  }
  return <Col className="w-full my-10">
    <Offerer buyer={buyer} />
    <hr className="my-10" />
    <OfferDetails
      contractRange={bidRequest.contractRange}
      message={bidRequest.message}
    />
  </Col>;
}

function Offerer({ buyer }: {
  buyer: PublicBuyerInfoT;
}) {
  const tMakeAnOffer = useTranslations("makeAnOffer");

  return <Col>
    <Heading>{tMakeAnOffer("offerer")}</Heading>
    <Profile
      name={buyer.username}
      thumbPath={buyer.company.thumbPath}
      title={[
        buyer.company.name,
        buyer.company.dept,
        buyer.company.position,
      ].join(" / ")}
    />
  </Col>;
}
