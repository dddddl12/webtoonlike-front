import React from "react";
import BidRequestList from "@/app/[locale]/offers/BidRequestList";
import PageLayout from "@/components/PageLayout";
import { listBidRequests } from "@/resources/bidRequests/bidRequest.service";
import { getTranslations } from "next-intl/server";
import { Heading } from "@/shadcn/ui/texts";

export default async function OffersPage() {
  const initialBidRequestListResponse = await listBidRequests();
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