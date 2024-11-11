import React from "react";
import { getEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.service";
import WebtoonEpisodeForm from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm";

export default async function UpdateWebtoonEpisode(
  { params }:
  {params: Promise<{webtoonId: string; episodeId: string}>},
) {

  const { episodeId } = await params;
  const episode = await getEpisode(Number(episodeId));

  return (
    <div className="bg-[#121212] min-h-screen">
      <WebtoonEpisodeForm episode={episode as never} webtoonId={Number(episode.webtoonId)} />
    </div>
  );
}
