"use client";

import { Col, Grid, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { displayName } from "@/utils/displayName";
import { HomeWebtoonItem } from "@/resources/home/home.types";

export default function WebtoonGrid({ webtoons, className }: {
  webtoons: HomeWebtoonItem[];
  className?: string;
}) {
  return <Row className={className}>
    {webtoons.length > 0
      ? <Grid
        className={"grid gap-7 w-full"}
        style={{
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))"
        }}
      >{
          webtoons.map((webtoon) =>
            <WebtoonItem
              key={webtoon.id}
              webtoon={webtoon}
            />)
        }</Grid>
      : <Text className="text-gray-shade mx-auto">등록된 웹툰이 없습니다.</Text>}
  </Row>;
}

function WebtoonItem({ webtoon }: {
  webtoon: HomeWebtoonItem;
}) {
  const locale = useLocale();

  return (
    <Col className="gap-2">
      <Link
        className="justify-center bg-gray-darker rounded-md overflow-hidden border relative h-[330px]"
        href={`/webtoons/${webtoon?.id}`}
      >
        <Image
          src={buildImgUrl(webtoon.thumbPath, { size: "sm" })}
          alt="Item thumbnail"
          fill
          className="object-cover transition ease-in-out delay-50 hover:border-2 rounded-md border-red duration-300"
        />
      </Link>
      <Col>
        <span
          className="text-[18px] font-bold">
          {displayName(locale, webtoon.title, webtoon.title_en)}
        </span>
        <span className="text-[14px]">
          {displayName(locale, webtoon.authorOrCreatorName, webtoon.authorOrCreatorName_en)}
        </span>
      </Col>
    </Col>
  );
}
