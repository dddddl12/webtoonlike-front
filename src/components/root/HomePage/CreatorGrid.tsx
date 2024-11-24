"use client";

import { Col, Row } from "@/components/ui/common";
import { useTranslations } from "next-intl";
import { buildImgUrl } from "@/utils/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import LinkWithAccessCheck from "@/components/root/HomePage/ui/LinkWithAccessCheck";
import { HomeItemsT } from "@/resources/home/home.dto";

export default function CreatorGrid({ creators }: {
  creators: HomeItemsT["creators"];
}) {
  return <Row className="w-full">
    <CreatorGridContent creators={creators}/>
  </Row>;
}

function CreatorGridContent({ creators }: {
  creators: HomeItemsT["creators"];
}) {
  if (creators.length === 0) {
    return <p className="text-gray-shade">등록된 작가가 없습니다.</p>;
  }
  return <div className="grid grid-cols-5 gap-7 w-full">{
    creators.map((creator) =>
      <CreatorItem key={creator.id} creator={creator}/>)
  }</div>;
}

export function CreatorItem({ creator }: {
  creator: HomeItemsT["creators"][number];
}) {
  const t = useTranslations("howMany");

  return (
    <LinkWithAccessCheck
      href={`/creators/${creator.id}`}
      creatorUid={creator.id}
    >
      <Col className="text-white bg-black-texts w-full h-[320px] rounded-md items-center justify-center transition ease-in-out delay-50 hover:bg-mint duration-300">
        <Avatar className="w-[100px] h-[100px]">
          <AvatarImage src={buildImgUrl(creator.thumbPath, {
            size: "sm",
            fallback: "user"
          })} />
          <AvatarFallback>{creator.thumbPath}</AvatarFallback>
        </Avatar>
        <span className="text-base font-bold mt-10">
          {creator.localized.name}
        </span>
        <span className="text-sm">
          {t("howMany", {
            number: creator.webtoonCount
          })}
        </span>
      </Col>
    </LinkWithAccessCheck>
  );
}
