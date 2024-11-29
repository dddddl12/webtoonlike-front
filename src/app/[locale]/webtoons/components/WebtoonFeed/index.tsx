import React from "react";
import PageLayout from "@/components/ui/PageLayout";
import { Heading1 } from "@/components/ui/common";
import { getTranslations } from "next-intl/server";
import WebtooonFeedList from "@/app/[locale]/webtoons/components/WebtoonFeed/WebtooonFeedList";
import { listGenres } from "@/resources/genres/genre.controller";
import { responseHandler } from "@/handlers/responseHandler";
import { listWebtoons } from "@/resources/webtoons/controllers/webtoonPreview.controller";

export default async function WebtoonFeed() {
  const [ genres, webtoonListResponse ] = await Promise.all([
    listGenres().then(responseHandler),
    listWebtoons({}).then(responseHandler)
  ]);
  const TallSeries = await getTranslations("allSeries");

  return (
    <PageLayout>
      <Heading1 className="text-[32px] font-bold">
        {TallSeries("allSeries")}
      </Heading1>
      <WebtooonFeedList
        genres={genres}
        initialWebtoonListResponse={webtoonListResponse}
      />
    </PageLayout>
  );
}