"use client";

import { Col, Gap, Grid, Row } from "@/ui/layouts";
import type { CreatorT } from "@/types";
import { Text } from "@/ui/texts";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { buildImgUrl } from "@/utils/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shadcn/Avatar";

export default function ArtistGrid({ artists }: {
    artists: CreatorT[]
}) {
  return <>
    <Gap y="36px" />
    <Row className="justify-center items-center">
      {artists.length > 0
        ? <Grid className="grid grid-cols-5 gap-4">{
          artists.map((artist) =>
            <ArtistItem key={artist.id} artist={artist}/>)
        }</Grid>
        : <Text className="text-gray-shade">등록된 작가가 없습니다.</Text>}
    </Row>
  </>;
}

export function ArtistItem({ artist }: {
  artist: CreatorT
}) {
  const router = useRouter();
  const t = useTranslations("howMany");
  const locale = useLocale();

  return (
    <div
      className="cursor-pointer"
      onClick={() => {router.push(`/creator/${artist.id}`);}}>
      <Col className="bg-black-texts w-full h-[320px] rounded-md items-center justify-center transition ease-in-out delay-50 hover:bg-mint duration-300">
        <Avatar className="w-[100px] h-[100px]">
          <AvatarImage src={buildImgUrl(null, artist?.thumbPath || "", { size: "sm" })} />
          <AvatarFallback>{artist.thumbPath}</AvatarFallback>
        </Avatar>
        <Gap y="10px" />
        <Text className="text-white">{artist.numWebtoon ?? 0} {t("howMany")}</Text>
        <Gap y="10px" />
        <Text className="text-white">{locale === "ko" ? artist.name : artist.name_en ?? artist.name}</Text>
      </Col>
    </div>
  );
}
