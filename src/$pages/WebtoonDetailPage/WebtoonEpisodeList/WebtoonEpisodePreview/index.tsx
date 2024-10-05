"use client";

import Image from "next/image";
import { Gap, Row, Col } from "@/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import type { WebtoonEpisodeT } from "@/types";
import { useLocale } from "next-intl";

type WebtoonEpisodePreview = {
  episode: WebtoonEpisodeT;
};

export function WebtoonEpisodePreview({ episode }: WebtoonEpisodePreview) {
  const locale = useLocale();
  return (
    <Row>
      {/* <div className='relative aspect-square w-[100px] overflow-hidden rounded-md'>
        {episode.thumbPath == null ? (
          <div className='h-full w-full bg-gray-200' />
        ) : (
          <Image
            src={buildImgUrl(null, episode.thumbPath)}
            alt={episode.thumbPath }
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </div> */}
      <Row className="min-w-[40px]">
        <p className='text-xl font-bold'>{episode.episodeNo} .</p>
      </Row>

      <Col>
        {locale === "ko"
          ? <p className='text-xl font-bold'>{episode.title}</p>
          : <p className='text-xl font-bold'>{episode.title_en}</p> }
      </Col>
    </Row>
  );
}
