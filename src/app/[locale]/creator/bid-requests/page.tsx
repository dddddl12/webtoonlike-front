import React from "react";
import BidRequestList from "@/app/[locale]/creator/bid-requests/BidRequestList";
import PageLayout from "@/components/PageLayout";
import { listBidRequests } from "@/resources/bidRequests/bidRequest.service";
import { getTranslations } from "next-intl/server";
import { Heading } from "@/ui/texts";

export default async function BidRound() {
  const initialBidRequestListResponse = await listBidRequests();
  const t = await getTranslations("manageOffers");
  return (
    <PageLayout>
      <Heading>
        {t("pendingSeries")}
      </Heading>
      <BidRequestList initialBidRequestListResponse={initialBidRequestListResponse} />
    </PageLayout>
  );
}