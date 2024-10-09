"use client";

import Image from "next/image";
import { Gap, Row } from "@/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import type { WebtoonT } from "@/types";
import { Text } from "@/ui/texts";
import { useLocale } from "next-intl";
import { getUserInfo } from "@/utils/authedUser";

type WebtoonPreviewProps = {
  webtoon: WebtoonT;
};

export function WebtoonPreview({ webtoon }: WebtoonPreviewProps) {
  const user = getUserInfo();
  const locale = useLocale();

  return (
    <div className='px-2 py-4 shadow-lg'>
      <div className='relative aspect-[3/4] w-full overflow-hidden rounded-md'>
        {webtoon.thumbPath == null ? (
          <div className='h-full w-full bg-gray-200' />
        ) : (
          <Image
            src={buildImgUrl(null, webtoon.thumbPath, { size: "sm" })}
            alt={webtoon.thumbPath}
            fill
            style={{ objectFit: "cover" }}
          />
        )}
        <div></div>
      </div>

      <Gap y={5} />

      <Text className='text-[16pt] font-bold text-white'>{locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title}</Text>

      <Text className='text-[12pt] text-gray-text line-clamp-2'>{locale === "ko" ? webtoon.description : webtoon.description_en ?? webtoon.description}</Text>

      <Gap y={2} />
      {webtoon.authorId == user.id && (
        <Row>
          <Text className="text-white bg-mint px-1 rounded-sm">{locale === "ko" ? "내 작품" : "My work" }</Text>
        </Row>
      )}
    </div>
  );
}
