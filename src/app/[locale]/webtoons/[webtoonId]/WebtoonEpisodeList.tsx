"use client";

import React, { Fragment } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { WebtoonT } from "@/resources/webtoons/webtoon.types";
import { WebtoonEpisodeT } from "@/resources/webtoonEpisodes/webtoonEpisode.types";

export function WebtoonEpisodeList({
  webtoon,
  editable,
}: {
  webtoon: WebtoonT;
  editable?: boolean;
}) {
  const t = useTranslations("episodePreviewDesc");
  const locale = useLocale();
  const episodes = (webtoon.episodes || [])
    .sort((a,b) => a.episodeNo < b.episodeNo ? -1 : 1);

  return (
    <div>
      {episodes.length == 0 && editable && (
        <Row className="justify-center bg-gray-darker p-3 rounded-sm">
          {t("pressAddEps")}
        </Row>
      )}
      {episodes.length == 0 && !editable && (
        <Row className="justify-center bg-gray-darker p-3 rounded-sm">
          {t("noEps")}
        </Row>
      )}

      <Col>
        {
          episodes.map(episode => (
            <Fragment key={episode.id}>
              <Row className="justify-between">
                <WebtoonEpisodePreview episode={episode} />
                <Row>
                  {episode.englishUrl && locale === "en" ? (
                    <Link
                      className="bg-white text-black rounded-sm w-[80px] px-2 py-1 flex justify-center items-center ml-3 cursor-pointer"
                      href={`https://${episode.englishUrl}`}
                    >
                      English
                    </Link>
                  ) : (
                    <Link
                      className="bg-white text-black rounded-sm w-[80px] px-2 py-1 flex justify-center items-center ml-3 cursor-pointer"
                      href={`/webtoons/${webtoon.id}/episodes/${episode.id}`}>
                      한국어</Link>
                  )}
                </Row>
              </Row>
              <Gap y={5} />
            </Fragment>
          ))
        }
      </Col>
    </div>
  );
}

function WebtoonEpisodePreview({ episode }: {
  episode: WebtoonEpisodeT;
}) {
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
