"use client";

import { Col, Grid, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { buildImgUrl } from "@/utils/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { displayName } from "@/utils/displayName";
import { HomeArtistItem } from "@/resources/home/home.types";

export default function ArtistGrid({ artists }: {
  artists: HomeArtistItem[];
}) {
  return <Row className="w-full">
    {artists.length > 0
      ? <Grid className="grid grid-cols-5 gap-7 w-full">{
        artists.map((artist) =>
          <ArtistItem key={artist.id} artist={artist}/>)
      }</Grid>
      : <Text className="text-gray-shade">등록된 작가가 없습니다.</Text>}
  </Row>;
}

export function ArtistItem({ artist }: {
  artist: HomeArtistItem;
}) {
  const t = useTranslations("howMany");
  const locale = useLocale();

  return (
    <Link href={`/creators/${artist.id}`}>
      <Col className="text-white bg-black-texts w-full h-[320px] rounded-md items-center justify-center transition ease-in-out delay-50 hover:bg-mint duration-300">
        <Avatar className="w-[100px] h-[100px]">
          <AvatarImage src={buildImgUrl(artist.thumbPath, {
            size: "sm",
            fallback: "user"
          })} />
          <AvatarFallback>{artist.thumbPath}</AvatarFallback>
        </Avatar>
        <span className="text-base font-bold mt-10">
          {displayName(locale, artist.name, artist.name_en)}
        </span>
        <span className="text-sm">
          {t("howMany", {
            number: artist.numOfWebtoons
          })}
        </span>
      </Col>
    </Link>
  );
}
