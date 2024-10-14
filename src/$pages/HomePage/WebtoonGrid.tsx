"use client";

import { Col, Gap, Grid, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { extractAuthorName, extractAuthorNameEn } from "@/utils/webtoon";
import { useState } from "react";
import type { WebtoonT } from "@backend/types/Webtoon";
import type { GenreT } from "@backend/types/Genre";

export default function WebtoonGrid({ webtoons }: {
    webtoons: WebtoonT[]
}) {
  const [selectedGenre, setSelectedGenre] = useState<GenreT | undefined>(undefined);
  return <>
    {/*  TODO*/}
    {/*<GenreSelector*/}
    {/*  withAll*/}
    {/*  selected={selectedGenre ? [selectedGenre] : []}*/}
    {/*  onGenreSelect={(genre) => setSelectedGenre(genre)}*/}
    {/*/>*/}
    <Gap y="36px" />
    <Row className="justify-center items-center">
      {webtoons.length > 0
        ? <Grid className="grid grid-cols-5 gap-4">{
          webtoons.map((webtoon) =>
            <WebtoonItem key={webtoon.id} webtoon={webtoon}/>)
        }</Grid>
        : <Text className="text-gray-shade">등록된 웹툰이 없습니다.</Text>}
    </Row>
  </>;
}

function WebtoonItem({ webtoon }: {
  webtoon: WebtoonT;
}) {
  const router = useRouter();
  const locale = useLocale();

  return (
    <Col>
      <Col className="w-[210px] h-[330px] justify-center bg-gray-darker rounded-md overflow-hidden border relative">
        <div
          className="w-[210px] h-[330px] cursor-pointer relative"
          onClick={() => {router.push(`/webtoons/${webtoon?.id}`);}}
        >
          <Image
            src={buildImgUrl(
              null,
              webtoon.thumbPath == null ? "" : webtoon.thumbPath,
              { size: "sm" },
            )}
            alt="Item thumbnail"
            fill={true}
            className="object-cover transition ease-in-out delay-50 hover:border-2 rounded-md border-red duration-300"
          />
        </div>
      </Col>
      <Gap y={2} />
      <Text className="text-white text-[18px] font-bold">{locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title}</Text>
      <Text className="text-white text-[14px]">
        {locale === "ko" ? extractAuthorName(webtoon) ?? "알 수 없음" : extractAuthorNameEn(webtoon) ?? "Unknown"}
      </Text>
    </Col>
  );
}
