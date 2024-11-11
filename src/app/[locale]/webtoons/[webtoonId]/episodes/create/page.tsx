import PageLayout from "@/components/PageLayout";
import { Gap, Row } from "@/shadcn/ui/layouts";
import { getTranslations } from "next-intl/server";
import WebtoonEpisodeForm from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm";

export default async function CreateWebtoonPost({ params } : {
  params: Promise<{webtoonId: string}>;
} ) {
  const webtoonId = await params.then(p => Number(p.webtoonId));
  const t = await getTranslations("detailedInfoPage");
  return (
    <PageLayout>
      <Row>
        {/*<FormHeader href={`/webtoons/${webtoonId}`}/>*/}
        <Gap x={2} />
        <div>{t("addEpisode")}</div>
      </Row>

      <Gap y={15}/>

      <WebtoonEpisodeForm webtoonId={webtoonId} />
    </PageLayout>
  );
}
