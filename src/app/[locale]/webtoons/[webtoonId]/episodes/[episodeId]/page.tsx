import React from "react";
import { WebtoonEpisodeDetailPage } from "@/$pages/WebtoonEpisodeDetailPage";

export default async function WebtoonEpisodeDetail(
  { params }:
  {params: {webtoonId: string, episodeId: string}},
) {


  const { data: episode } = await WebtoonEpisodeApi.get(parseInt(params.episodeId), { $images: true });
  const { data: webtoon } = await WebtoonApi.get(episode.webtoonId);

  return (
    <div className="bg-[#121212] min-h-screen">
      <WebtoonEpisodeDetailPage
        webtoon={webtoon}
        episode={episode}
      />
    </div>
  );
}
