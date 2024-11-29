import { Heading1 } from "@/components/ui/common";
import BidRoundForm from "@/components/forms/BidRoundForm";
import PageLayout from "@/components/ui/PageLayout";
import { getTranslations } from "next-intl/server";

export default async function CreateBidRoundPage({ params }: {
  params: Promise<{webtoonId: string}>;
}) {
  const webtoonId = await params.then(p => Number(p.webtoonId));
  const t = await getTranslations("seriesManagement");
  return (
    <PageLayout>
      <Heading1>
        {t("registerOfContentTransactions")}
      </Heading1>
      <BidRoundForm webtoonId={webtoonId} />
    </PageLayout>
  );
}
