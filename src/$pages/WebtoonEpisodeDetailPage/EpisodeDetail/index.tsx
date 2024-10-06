"use client";

import React, { Fragment } from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Col, Gap, Row } from "@/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import { IconLeftBrackets } from "@/components/svgs/IconLeftBrackets";
import { Text } from "@/ui/texts";
import type { WebtoonEpisodeT, WebtoonT } from "@/types";
import { DownloadEpisodeImage } from "./DownloadEpisodeImage";
import { AddEnglishEpisodeUrl } from "./AddEnglishEpisodeUrl";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useAdmin, useMe } from "@/states/UserState";

type EpisodeDetailProps = {
  webtoon: WebtoonT;
  episode: WebtoonEpisodeT;
};

export function EpisodeDetail({ webtoon, episode }: EpisodeDetailProps) {
  const router = useRouter();
  const t = useTranslations("detailedInfoPage");
  const locale = useLocale();
  const me = useMe();
  const admin = useAdmin();

  return (
    <Col className="text-white max-w-[800px] m-auto">
      <Gap y={5} />
      <Row>
        <div
          className="cursor-pointer"
          onClick={() => {
            router.push(`/webtoons/${webtoon.id}`);
          }}
        >
          <IconLeftBrackets className="fill-white" width={24} height={24} />
        </div>
        <Text className="text-3xl font-bold text-white">
          {locale === "ko"
            ? `${webtoon.title} _ ${episode.episodeNo}화`
            : `${webtoon.title_en} _ Episode ${episode.episodeNo}` ?? webtoon.title}
        </Text>
      </Row>

      <Gap y={10} />

      <AddEnglishEpisodeUrl webtoon={webtoon} episode={episode} />
      <DownloadEpisodeImage webtoon={webtoon} episode={episode} />

      <Gap y={10} />

      <Row className="justify-between">
        <p className="text-xl font-bold">{episode.title}</p>
        {((me?.creator && webtoon.authorId === me.id) || admin) && (
          <Row
            className="cursor-pointer"
            onClick={() => {
              router.push(
                `/webtoons/${webtoon.id}/episodes/${episode.id}/update`
              );
            }}
          >
            <Pencil1Icon className="text-mint" width={25} height={25} />
            <Gap x={1} />
            <Text className="text-mint">{t("goEdit")}</Text>
          </Row>
        )}
      </Row>

      <Gap y={4} />

      <Col>
        {(episode?.images ?? []).map((image) => {
          return (
            <Fragment key={image.id}>
              <img
                width="100%"
                src={buildImgUrl(null, image.path)}
                alt={image.path}
              />
            </Fragment>
          );
        })}
      </Col>

      <Gap y={40} />
    </Col>
  );
}
