import { useTranslations } from "next-intl";
import { Col } from "@/components/ui/common";
import { Heading } from "@/components/ui/common";
import { getPublicBuyerInfoByUserId } from "@/resources/buyers/buyer.controller";
import { useEffect, useMemo, useState } from "react";
import { PublicBuyerInfoT } from "@/resources/buyers/buyer.dto";
import Spinner from "@/components/ui/Spinner";
import OfferDetails from "@/components/shared/OfferDetails";
import Profile from "@/components/shared/Profile";
import useSafeAction from "@/hooks/safeAction";
import { BidRequestWithMetaDataT } from "@/resources/bidRequests/dtos/bidRequestWithMetadata.dto";

export default function ViewOfferSection({ bidRequest }: {
  bidRequest: BidRequestWithMetaDataT;
}) {
  const [buyer, setBuyer] = useState<PublicBuyerInfoT>();
  const buyerUserId = bidRequest.buyer.user.id;

  const boundGetPublicBuyerInfoByUserId = useMemo(() =>
    getPublicBuyerInfoByUserId.bind(null, buyerUserId), [buyerUserId]);
  const { execute } = useSafeAction(boundGetPublicBuyerInfoByUserId, {
    onSuccess: ({ data }) => {
      if (!data) {
        throw new Error("data is null");
      }
      setBuyer(data);
    }
  });

  useEffect(() => {
    execute();
  }, [execute]);

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
  const tMakeAnOffer = useTranslations("offerDetails");

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
