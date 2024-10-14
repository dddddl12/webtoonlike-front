import React from "react";
import { cookies } from "next/headers";
import { WebtoonDetailPage } from "@/$pages/WebtoonDetailPage";
import * as WebtoonApi from "@/apis/webtoons";
import { tokenHolder } from "@/system/token_holder";
import { ErrorComponent } from "@/components/ErrorComponent";
import type { GetWebtoonOptionT } from "@backend/types/Webtoon";

export default async function WebtoonDetail({ params }: { params: { webtoonId: string } }) {
  try {
    const getOpt: GetWebtoonOptionT = {
      $myLike: true,
      $bidRounds: true,
      $episodes: true,
      $creator: true,
      $genres: true,
      $numRequest: true,
    };
    const { data: webtoon } = await tokenHolder.serverFetchWithCredential(cookies, async () => {
      return WebtoonApi.get(parseInt(params.webtoonId), getOpt);
    });

    return (
      <div className="bg-[#121212] min-h-screen">
        <WebtoonDetailPage webtoon={webtoon}/>
      </div>
    );
  } catch (e){
    console.log(e);
    return (
      <ErrorComponent />
    );
  }
}
