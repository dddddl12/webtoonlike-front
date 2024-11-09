import { Heading } from "@/shadcn/ui/texts";
import BidRoundForm from "@/app/[locale]/webtoons/components/forms/BidRoundForm";
import { getTranslations } from "next-intl/server";
import PageLayout from "@/components/PageLayout";
import { getBidRound } from "@/resources/bidRounds/bidRound.service";

export default async function UpdateBidRoundPage({ params }: {
  params: Promise<{webtoonId: string}>
}) {
  const webtoonId = await params.then(p => Number(p.webtoonId));
  const bidRound = await getBidRound(webtoonId);
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
