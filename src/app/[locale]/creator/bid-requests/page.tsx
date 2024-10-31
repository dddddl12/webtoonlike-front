import React from "react";
import { BidRequestList } from "@/app/[locale]/creator/bid-requests/BidRequestList";
import PageLayout from "@/components/PageLayout";
import { listBidRequests } from "@/resources/bidRequests/bidRequest.service";
import { Heading } from "@/ui/texts";
import { Col, Gap } from "@/ui/layouts";
import { getTranslations } from "next-intl/server";

export default async function BidRound() {
  const initialBidRequestList = await listBidRequests();
  const t = await getTranslations("manageOffers");
  return (
    <PageLayout>
      <Col className="text-white">
        <Heading className="font-bold text-[26pt]">
          {t("pendingSeries")}
        </Heading>
        <Gap y={10}/>

        <BidRequestList initialBidRequestList={initialBidRequestList} />
      </Col>
    </PageLayout>
  );
}