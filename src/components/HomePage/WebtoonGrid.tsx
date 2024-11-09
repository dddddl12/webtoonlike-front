"use client";

import { Col, Gap, Grid, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { useState } from "react";
import { HomeWebtoonItem } from "@/resources/webtoons/webtoon.types";
import { GenreT } from "@/resources/genres/genre.types";
import { displayName } from "@/utils/displayName";

export default function WebtoonGrid({ webtoons, numbered, cols, height }: {
  webtoons: HomeWebtoonItem[];
  numbered?: boolean;
  cols: number;
  height: number;
}) {
  const [selectedGenre, setSelectedGenre] = useState<GenreT | undefined>(undefined);
  return <>
    {/*  TODO*/}
    {/*<GenreSelector*/}
    {/*  withAll*/}
    {/*  selected={selectedGenre ? [selectedGenre] : []}*/}
    {/*  onGenreSelect={(genre) => setSelectedGenre(genre)}*/}
    {/*/>*/}
    <Row className="w-full">
      {webtoons.length > 0
        ? <Grid
          className={"grid gap-7 w-full"}
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
          }}
        >{
            webtoons.map((webtoon, index) =>
              <WebtoonItem
                key={webtoon.id}
                webtoon={webtoon}
                height={height}
                index={numbered ? index : -1}/>)
          }</Grid>
        : <Text className="text-gray-shade">등록된 웹툰이 없습니다.</Text>}
    </Row>
  </>;
}

function WebtoonItem({ webtoon, height, index }: {
  webtoon: HomeWebtoonItem;
  height: number;
  index: number
}) {
  const locale = useLocale();

  return (
    <Col>
      <Link
        className="justify-center bg-gray-darker rounded-md overflow-hidden border relative"
        style={{
          height: `${height}px`
        }}
        href={`/webtoons/${webtoon?.id}`}
      >
        <Image
          src={buildImgUrl(webtoon.thumbPath, { size: "sm" })}
          alt="Item thumbnail"
          fill={true}
          className="object-cover transition ease-in-out delay-50 hover:border-2 rounded-md border-red duration-300"
        />
      </Link>
      <Gap y={2} />
      <Row className="text-white align-middle">
        {index > -1 && <span className="text-[40px] font-bold mr-4">
          {index + 1}
        </span>}
        <Col>
          <span
            className="text-[18px] font-bold">
            {displayName(locale, webtoon.title, webtoon.title_en)}
          </span>
          <span className="text-[14px]">
            {displayName(locale, webtoon.authorOrCreatorName, webtoon.authorOrCreatorName_en)}
          </span>
        </Col>
      </Row>
    </Col>
  );
}
