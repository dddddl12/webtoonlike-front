import { Heading } from "@/shadcn/ui/texts";
import BidRoundForm from "@/components/forms/BidRoundForm";
import { getTranslations } from "next-intl/server";
import PageLayout from "@/components/PageLayout";
import { getBidRoundByWebtoonId } from "@/resources/bidRounds/bidRound.service";
import { responseHandler } from "@/handlers/responseHandler";

export default async function UpdateBidRoundPage({ params }: {
  params: Promise<{webtoonId: string}>;
}) {
  const webtoonId = await params.then(p => Number(p.webtoonId));
  const bidRound = await getBidRoundByWebtoonId(webtoonId)
    .then(responseHandler);
  const t = await getTranslations("seriesManagement");
  return (
    <PageLayout>
      <Heading>
        {t("reregisterOfContentTransactions")}
      </Heading>
      <BidRoundForm webtoonId={webtoonId} prev={bidRound} />
    </PageLayout>
  );
}
