import React from "react";
import { UpdateWebtoonEpisodetPage } from "@/app/[locale]/webtoons/[webtoonId]/update/UpdateWebtoonEpisodetPage";
import { getEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.service";

export default async function UpdateWebtoonEpisode(
  { params }:
  {params: Promise<{webtoonId: string; episodeId: string}>},
) {

  const { episodeId } = await params;
  const episode = await getEpisode(Number(episodeId));

  return (
    <div className="bg-[#121212] min-h-screen">
      <UpdateWebtoonEpisodetPage episode={episode}/>
    </div>
  );
}
