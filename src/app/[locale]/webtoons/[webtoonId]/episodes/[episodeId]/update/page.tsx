import { getEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.service";
import WebtoonEpisodeForm from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm";
import PageLayout from "@/components/PageLayout";

export default async function UpdateWebtoonEpisode(
  { params }:
  {params: Promise<{webtoonId: string; episodeId: string}>},
) {

  const { episodeId } = await params;
  const episode = await getEpisode(Number(episodeId));

  return (
    <PageLayout>
      <WebtoonEpisodeForm prev={episode} webtoonId={Number(episode.webtoonId)} />
    </PageLayout>
  );
}
