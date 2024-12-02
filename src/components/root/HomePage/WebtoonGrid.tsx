"use client";

import { Col, Row } from "@/components/ui/common";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { HomeWebtoonItem } from "@/resources/home/home.dto";
import LinkWithAccessCheck from "@/components/root/HomePage/ui/LinkWithAccessCheck";

export default function WebtoonGrid({ webtoons, className }: {
  webtoons: HomeWebtoonItem[];
  className?: string;
}) {
  return <Row className={className}>
    <WebtoonGridContent webtoons={webtoons}/>
  </Row>;
}

function WebtoonGridContent({ webtoons }: {
  webtoons: HomeWebtoonItem[];
}) {
  if (webtoons.length === 0) {
    return <p className="text-gray-shade mx-auto">등록된 웹툰이 없습니다.</p>;
  }
  return <div
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
    }</div>;
}

function WebtoonItem({ webtoon }: {
  webtoon: HomeWebtoonItem;
}) {
  return (
    <Col className="gap-2">
      <LinkWithAccessCheck
        className="justify-center bg-gray-darker rounded-md overflow-hidden border relative h-[330px]"
        href={`/webtoons/${webtoon?.id}`}
        creatorUid={webtoon.creator.user.id}
      >
        <Image
          src={buildImgUrl(webtoon.thumbPath, { size: "sm" })}
          alt="Item thumbnail"
          fill
          className="object-cover transition ease-in-out delay-50 hover:border-2 rounded-md border-red duration-300"
        />
      </LinkWithAccessCheck>
      <Col>
        <span
          className="text-lg font-bold">
          {webtoon.localized.title}
        </span>
        <span className="text-sm">
          {webtoon.localized.authorOrCreatorName}
        </span>
      </Col>
    </Col>
  );
}
