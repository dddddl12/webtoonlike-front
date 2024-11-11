import { Heading } from "@/shadcn/ui/texts";
import BidRoundForm from "@/app/[locale]/webtoons/components/forms/BidRoundForm";
import PageLayout from "@/components/PageLayout";
import { getTranslations } from "next-intl/server";

export default async function CreateBidRoundPage({ params }: {
  params: Promise<{webtoonId: string}>;
}) {
  const webtoonId = await params.then(p => Number(p.webtoonId));
  const t = await getTranslations("seriesManagement");
  return (
    <PageLayout>
      <Heading>
        {t("registerOfContentTransactions")}
      </Heading>
      <BidRoundForm webtoonId={webtoonId} />
    </PageLayout>
  );
}
