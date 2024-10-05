"use client";

import Image from "next/image";
import { Col, Gap } from "@/ui/layouts";
import { WebtoonT } from "@/types";
import { buildImgUrl } from "@/utils/media";
import { Text } from "@/ui/texts";
import { extractAuthorName, extractAuthorNameEn } from "@/utils/webtoon";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

type PropT = {
  webtoon: WebtoonT;
};

export function RecommendCarouselItem({ webtoon }: PropT) {
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
