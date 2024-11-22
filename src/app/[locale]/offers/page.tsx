import React from "react";
import BidRequestList from "@/app/[locale]/offers/BidRequestList";
import PageLayout from "@/components/PageLayout";
import { getTranslations } from "next-intl/server";
import { Heading } from "@/shadcn/ui/texts";
import { listAllBidRequests } from "@/resources/bidRequests/bidRequest.controller";
import { responseHandler } from "@/handlers/responseHandler";

export default async function OffersPage() {
  const initialBidRequestListResponse = await listAllBidRequests({})
    .then(responseHandler);
  const t = await getTranslations("manageOffers");
  return (
    <PageLayout>
      <Heading>
        오퍼 관리
      </Heading>
      <BidRequestList initialBidRequestListResponse={initialBidRequestListResponse} />
    </PageLayout>
  );
}