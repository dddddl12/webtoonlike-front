import { Heading1 } from "@/components/ui/common";
import BidRoundForm from "@/components/forms/BidRoundForm";
import { getTranslations } from "next-intl/server";
import PageLayout from "@/components/ui/PageLayout";
import { getBidRoundByWebtoonId } from "@/resources/bidRounds/controllers/bidRound.controller";
import { serverResponseHandler } from "@/handlers/serverResponseHandler";

export default async function UpdateBidRoundPage({ params }: {
  params: Promise<{webtoonId: string}>;
}) {
  const webtoonId = await params.then(p => Number(p.webtoonId));
  const bidRound = await getBidRoundByWebtoonId(webtoonId)
    .then(serverResponseHandler);
  const t = await getTranslations("seriesManagement");
  return (
    <PageLayout>
      <Heading1>
        {t("reregisterOfContentTransactions")}
      </Heading1>
      <BidRoundForm webtoonId={webtoonId} prev={bidRound} />
    </PageLayout>
  );
}
