import React from "react";
import ContractRange from "@/app/[locale]/webtoons/[webtoonId]/ContractRange";
import { getWebtoon } from "@/resources/webtoons/webtoon.service";
import WebtoonDetails from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetails";
import PageLayout from "@/components/PageLayout";
import { getTranslations } from "next-intl/server";

export default async function WebtoonInfo({ params }:
{ params: Promise<{ webtoonId: string }> }) {
  const { webtoonId } = await params;
  const webtoon = await getWebtoon(Number(webtoonId));

  return (
    <PageLayout>
      <WebtoonDetails webtoon={webtoon}/>

      <hr className="border-gray-shade my-10"/>

      <ContractRange webtoon={webtoon}/>

    </PageLayout>
  );
}
