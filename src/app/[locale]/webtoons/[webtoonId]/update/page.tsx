import React from "react";
import PageLayout from "@/components/PageLayout";
import { Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { UpdateWebtoonForm } from "@/app/[locale]/webtoons/[webtoonId]/update/UpdateWebtoonForm";
import { getLocale } from "next-intl/server";
import { getWebtoon } from "@/resources/webtoons/webtoon.service";
import { Link } from "@/i18n/routing";


export default async function UpdateWebtoon({ params }: {params: {webtoonId: string}}) {

  const { webtoonId } = await params;
  const webtoon = await getWebtoon(Number(webtoonId));
  const locale = await getLocale();

  return (
    <PageLayout>
      <Row>
        <Link
          // variant='ghost' // TODO
          href={`/webtoons/${webtoon.id}`}>
          <ArrowLeftIcon width={32} height={32} />
        </Link>

        <Gap x={2}/>

        <h1 className='text-xl'>
          {locale === "en" ? "Edit webtoon" : "작품 수정하기"}
        </h1>
      </Row>

      <Gap y={15}/>

      <UpdateWebtoonForm webtoon={webtoon}/>

    </PageLayout>
  );
}
