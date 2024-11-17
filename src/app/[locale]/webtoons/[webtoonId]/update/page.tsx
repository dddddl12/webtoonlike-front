import React from "react";
import PageLayout from "@/components/PageLayout";
import { getWebtoon } from "@/resources/webtoons/webtoon.service";
import { WebtoonForm } from "@/app/[locale]/webtoons/components/forms/WebtoonForm";
import { listGenres } from "@/resources/genres/genre.service";
import { responseHandler } from "@/handlers/responseHandler";

export default async function UpdateWebtoonPage({ params }: {
  params: Promise<{webtoonId: string}>;
}) {

  const webtoonId = await params.then(p => Number(p.webtoonId));
  const [webtoon, genres] = await Promise.all([
    getWebtoon(webtoonId).then(responseHandler),
    listGenres().then(responseHandler)
  ]);
  return (
    <PageLayout>
      <WebtoonForm selectableGenres={genres} prev={webtoon}/>
    </PageLayout>
  );
}
