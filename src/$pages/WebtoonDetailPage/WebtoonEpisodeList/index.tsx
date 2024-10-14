"use client";

import React, { Fragment } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { WebtoonEpisodePreview } from "./WebtoonEpisodePreview";
import type { WebtoonT } from "@/types";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { getServerUserInfo } from "@/utils/auth/server";

type WebtoonEpisodeListProps = {
  webtoon: WebtoonT;
  editable?: boolean;
};

export function WebtoonEpisodeList({
  webtoon,
  editable,
}: WebtoonEpisodeListProps) {
  const router = useRouter();
  const user = getServerUserInfo();
  const t = useTranslations("episodePreviewDesc");
  const locale = useLocale();
  const episodes = (webtoon.episodes || [])
    .sort((a,b) => a.episodeNo < b.episodeNo ? -1 : 1);

  return (
    <div>
      {episodes.length == 0 && webtoon.authorId == user.id && (
        <Row className="justify-center bg-gray-darker p-3 rounded-sm">
          {t("pressAddEps")}
        </Row>
      )}
      {episodes.length == 0 && webtoon.authorId != user.id && (
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
                    <div
                      className="bg-white text-black rounded-sm w-[80px] px-2 py-1 flex justify-center items-center ml-3 cursor-pointer"
                      onClick={() => {router.push(`https://${episode.englishUrl}`);}}
                    >
                      English
                    </div>
                  ) : (
                    <div
                      className="bg-white text-black rounded-sm w-[80px] px-2 py-1 flex justify-center items-center ml-3 cursor-pointer"
                      onClick={() => { router.push(`/webtoons/${webtoon.id}/episodes/${episode.id}`); }}>
                      한국어</div>
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
