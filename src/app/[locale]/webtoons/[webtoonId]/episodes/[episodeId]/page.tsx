import React, { Fragment } from "react";
import PageLayout from "@/components/PageLayout";
import { Col, Gap, Row } from "@/ui/layouts";
import { IconLeftBrackets } from "@/components/svgs/IconLeftBrackets";
import { Text } from "@/ui/texts";
// import { AddEnglishEpisodeUrl } from "@/app/[locale]/webtoons/[webtoonId]/episodes/[episodeId]/AddEnglishEpisodeUrl";
// import { DownloadEpisodeImage } from "@/app/[locale]/webtoons/[webtoonId]/episodes/[episodeId]/DownloadEpisodeImage";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { buildImgUrl } from "@/utils/media";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getEpisodeWidthWebtoonInfo } from "@/resources/webtoonEpisodes/webtoonEpisode.service";
import { getUserInfo } from "@/utils/auth/server";

export default async function WebtoonEpisodeDetail(
  { params }:
  {params: {webtoonId: string, episodeId: string}},
) {
  const { episodeId } = await params;
  const episode = await getEpisodeWidthWebtoonInfo(Number(episodeId));
  const { webtoon } = episode;
  const user = await getUserInfo();

  const locale = await getLocale();
  const t = await getTranslations("detailedInfoPage");

  const webtoonTitle = locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title;

  return (
    <PageLayout>
      <Row>
        <Link href={`/webtoons/${webtoon.id}`}>
          <IconLeftBrackets className="fill-white" width={24} height={24} />
        </Link>
        <Text className="text-3xl font-bold text-white">
          {`${webtoonTitle} _ ${t("episodeSeq", {
            number: episode.episodeNo
          })}`}
        </Text>
      </Row>

      <Gap y={10} />

      {/*<AddEnglishEpisodeUrl webtoon={webtoon} episode={episode} />*/}
      {/*<DownloadEpisodeImage webtoon={webtoon} episode={episode} />*/}

      <Gap y={10} />

      <Row className="justify-between">
        <p className="text-xl font-bold">{episode.title}</p>
        {(webtoon.authorId === user.id || user.adminLevel > 0) && (
          <Link href={`/webtoons/${webtoon.id}/episodes/${episode.id}/update`}>
            <Pencil1Icon className="text-mint" width={25} height={25} />
            <Gap x={1} />
            <Text className="text-mint">{t("goEdit")}</Text>
          </Link>
        )}
      </Row>

      <Gap y={4} />

      <Col>
        {episode.WebtoonEpisodeImage.map((image) => {
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

    </PageLayout>
  );
}
