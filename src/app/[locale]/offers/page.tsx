import React from "react";
import OfferList from "@/app/[locale]/offers/OfferList";
import PageLayout from "@/components/ui/PageLayout";
import { getTranslations } from "next-intl/server";
import { Heading1 } from "@/components/ui/common";
import { serverResponseHandler } from "@/handlers/serverResponseHandler";
import { listAllOffers } from "@/resources/offers/controllers/offer.controller";

export default async function OffersPage() {
  const initialOfferListResponse = await listAllOffers({})
    .then(serverResponseHandler);
  const t = await getTranslations("headerNav");
  return (
    <PageLayout>
      <Heading1>
        {t("manageOffers")}
      </Heading1>
      <OfferList initialOfferListResponse={initialOfferListResponse} />
    </PageLayout>
  );
}