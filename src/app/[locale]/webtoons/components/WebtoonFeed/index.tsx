import React from "react";
import PageLayout from "@/components/PageLayout";
import { Gap, Row } from "@/shadcn/ui/layouts";
import { Heading } from "@/shadcn/ui/texts";
import { getTranslations } from "next-intl/server";
import WebtooonFeedList from "@/app/[locale]/webtoons/components/WebtoonFeed/WebtooonFeedList";
import { listGenres } from "@/resources/genres/genre.service";
import { listWebtoons } from "@/resources/webtoons/webtoon.service";
import { responseHandler } from "@/handlers/responseHandler";

export default async function WebtoonFeed() {
  const [ genres, webtoonListResponse ] = await Promise.all([
    listGenres().then(responseHandler),
    listWebtoons({}).then(responseHandler)
  ]);
  const TallSeries = await getTranslations("allSeries");

  return (
    <PageLayout>
      <Row className="w-[1200px]">
        <Heading className="text-white text-[32px] font-bold">
          {TallSeries("allSeries")}
        </Heading>
      </Row>
      <Gap y={10} />
      <WebtooonFeedList
        genres={genres}
        initialWebtoonListResponse={webtoonListResponse}
      />
    </PageLayout>
  );
}