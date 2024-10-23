import React from "react";
import { UpdateWebtoonEpisodetPage } from "@/$pages/UpdateWebtoonEpisodePage";

export default async function UpdateWebtoonEpisode(
  { params }:
  {params: {webtoonId: string, episodeId: string}},
) {


  const { data: episode } = await WebtoonEpisodeApi.get(parseInt(params.episodeId), { $images: true });
  return (
    <div className="bg-[#121212] min-h-screen">
      <UpdateWebtoonEpisodetPage episode={episode}/>
    </div>
  );
}
