import React from "react";
import { WebtoonEpisodeDetailPage } from "@/$pages/WebtoonEpisodeDetailPage";
import * as WebtoonEpisodeApi from "@/apis/webtoon_episodes";
import * as WebtoonApi from "@/apis/webtoons";

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
