"use client";

import { Col, Gap, Grid, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { buildImgUrl } from "@/utils/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shadcn/Avatar";
import { HomeArtistItem } from "@/resources/webtoons/webtoon.types";
import { displayName } from "@/utils/displayName";

export default function ArtistGrid({ artists }: {
  artists: HomeArtistItem[]
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
  artist: HomeArtistItem
}) {
  const router = useRouter();
  const t = useTranslations("howMany");
  const locale = useLocale();

  return (
    <Link href={`/creator/${artist.id}`}>
      <Col className="text-white bg-black-texts w-full h-[320px] rounded-md items-center justify-center transition ease-in-out delay-50 hover:bg-mint duration-300">
        <Avatar className="w-[100px] h-[100px]">
          <AvatarImage src={buildImgUrl(null, artist?.thumbPath || "", { size: "sm" })} />
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
