"use client";

import { Row, Col } from "@/ui/layouts";
import { useLocale, useTranslations } from "next-intl";
import type { WebtoonEpisodeT } from "@backend/types/WebtoonEpisode";

type WebtoonEpisodePreview = {
  episode: WebtoonEpisodeT;
};

export function WebtoonEpisodePreview({ episode }: WebtoonEpisodePreview) {
  const locale = useLocale();
  const t = useTranslations("detailedInfoPage");
  return (
    <Row>
      <Row className="min-w-[40px]">
        <p className='text-xl font-bold'>
          {t("episodeSeq", { number: episode.episodeNo })}
        </p>
      </Row>

      <Col>
        {locale === "ko"
          ? <p className='text-xl font-bold'>{episode.title}</p>
          : <p className='text-xl font-bold'>{episode.title_en}</p> }
      </Col>
    </Row>
  );
}
