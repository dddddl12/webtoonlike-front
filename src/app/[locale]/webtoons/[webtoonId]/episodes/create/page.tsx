import PageLayout from "@/components/PageLayout";
import WebtoonEpisodeForm from "@/components/forms/WebtoonEpisodeForm";

export default async function CreateWebtoonPost({ params } : {
  params: Promise<{webtoonId: string}>;
} ) {
  const webtoonId = await params.then(p => Number(p.webtoonId));
  return (
    <PageLayout>
      <WebtoonEpisodeForm webtoonId={webtoonId} />
    </PageLayout>
  );
}
