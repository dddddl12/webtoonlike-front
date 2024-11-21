"use client";

import { Col, Grid, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { useLocale, useTranslations } from "next-intl";
import { buildImgUrl } from "@/utils/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { displayName } from "@/utils/displayName";
import { HomeCreatorItem } from "@/resources/home/home.types";
import LinkWithAccessCheck from "@/components/HomePage/LinkWithAccessCheck";

export default function CreatorGrid({ creators }: {
  creators: HomeCreatorItem[];
}) {
  return <Row className="w-full">
    {creators.length > 0
      ? <Grid className="grid grid-cols-5 gap-7 w-full">{
        creators.map((creator) =>
          <CreatorItem key={creator.id} creator={creator}/>)
      }</Grid>
      : <Text className="text-gray-shade">등록된 작가가 없습니다.</Text>}
  </Row>;
}

export function CreatorItem({ creator }: {
  creator: HomeCreatorItem;
}) {
  const t = useTranslations("howMany");
  const locale = useLocale();

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
          {displayName(locale, creator.name, creator.name_en)}
        </span>
        <span className="text-sm">
          {t("howMany", {
            number: creator.numOfWebtoons
          })}
        </span>
      </Col>
    </LinkWithAccessCheck>
  );
}
