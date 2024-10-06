"use client";

import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shadcn/Avatar";
import { CreatorT } from "@/types";
import { buildImgUrl } from "@/utils/media";
import { useLocale, useTranslations } from "next-intl";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import { useRouter } from "@/i18n/routing";

type ArtistCarouselItemT = {
  artist: CreatorT
}

export function ArtistCarouselItem({ artist }: ArtistCarouselItemT) {
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
        <Gap y="20px" />
        <Row>
          {artist.numWebtoonLike
            ? <Text className="text-white">{artist.numWebtoonLike}</Text>
            : <Text className="text-white">0</Text> }
          <Gap x={1} />
          <IconHeartFill className="fill-red" />

        </Row>
        <Gap y="10px" />
        <Text className="text-white">{artist.numWebtoon ?? 0} {t("howMany")}</Text>
        <Gap y="10px" />
        <Text className="text-white">{locale === "ko" ? artist.name : artist.name_en ?? artist.name}</Text>
      </Col>
    </div>
  );
}
