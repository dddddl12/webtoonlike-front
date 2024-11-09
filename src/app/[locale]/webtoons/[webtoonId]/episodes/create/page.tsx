import PageLayout from "@/components/PageLayout";
import { Gap, Row } from "@/shadcn/ui/layouts";
import FormHeader from "@/components/ui/formComponents";
import { getTranslations } from "next-intl/server";

export default async function CreateWebtoonPost({ params } : {
  params: Promise<{webtoonId: string}>
} ) {
  const webtoonId = await params.then(p => Number(p.webtoonId));
  const t = await getTranslations("detailedInfoPage");
  return (
    <PageLayout>
      <Row>
        <FormHeader href={`/webtoons/${webtoonId}`}/>
        <Gap x={2} />
        <div>{t("addEpisode")}</div>
      </Row>

      <Gap y={15}/>

      <CreateWebtoonEpisodeForm webtoonId={webtoonId} />
    </PageLayout>
  );
}
