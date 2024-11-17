import { getEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.service";
import WebtoonEpisodeForm from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm";
import PageLayout from "@/components/PageLayout";
import { responseHandler } from "@/handlers/responseHandler";

export default async function UpdateWebtoonEpisode(
  { params }:
  {params: Promise<{webtoonId: string; episodeId: string}>},
) {

  const episodeId = await params
    .then(({ episodeId }) => Number(episodeId));
  const episode = await getEpisode(episodeId)
    .then(responseHandler);

  return (
    <PageLayout>
      <WebtoonEpisodeForm prev={episode} webtoonId={Number(episode.webtoonId)} />
    </PageLayout>
  );
}
