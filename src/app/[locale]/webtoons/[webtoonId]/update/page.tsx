import React from "react";
import { UpdateWebtoonPage } from "@/$pages/UpdateWebtoonPage";


export default async function UpdateWebtoon({ params }: {params: {webtoonId: string}}) {

  const { data: webtoon } = await WebtoonApi.get(parseInt(params.webtoonId), { $genres: true });

  return (
    <div className="bg-[#121212] min-h-screen">
      <UpdateWebtoonPage webtoon={webtoon} />
    </div>
  );
}
