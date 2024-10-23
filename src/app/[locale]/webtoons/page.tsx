import React from "react";
import PageLayout from "@/components/PageLayout";
import { Gap, Row } from "@/ui/layouts";
import { Heading } from "@/ui/texts";
import { getTranslations } from "next-intl/server";
import { WebtooonFeedList } from "@/app/[locale]/webtoons/WebtooonFeedList";
import { listGenres } from "@/resources/genres/genre.service";
import { listWebtoons } from "@/resources/webtoons/webtoon.service";

export default async function Webtoons() {
  const [ genres, webtoonList ] = await Promise.all([
    listGenres(),
    listWebtoons()
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
        initialWebtoonList={webtoonList}
      />
    </PageLayout>
  );
}