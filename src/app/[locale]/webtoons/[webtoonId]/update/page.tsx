import React from "react";
import PageLayout from "@/components/ui/PageLayout";
import { WebtoonForm } from "@/components/forms/WebtoonForm";
import { listGenres } from "@/resources/genres/genre.controller";
import { serverResponseHandler } from "@/handlers/serverResponseHandler";
import { getWebtoon } from "@/resources/webtoons/controllers/webtoonDetails.controller";

export default async function UpdateWebtoonPage({ params }: {
  params: Promise<{webtoonId: string}>;
}) {

  const webtoonId = await params.then(p => Number(p.webtoonId));
  const [webtoon, genres] = await Promise.all([
    getWebtoon(webtoonId).then(serverResponseHandler),
    listGenres().then(serverResponseHandler)
  ]);
  return (
    <PageLayout>
      <WebtoonForm selectableGenres={genres} prev={webtoon}/>
    </PageLayout>
  );
}
