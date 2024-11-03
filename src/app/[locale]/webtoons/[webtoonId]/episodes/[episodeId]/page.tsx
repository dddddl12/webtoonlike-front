import PageLayout from "@/components/PageLayout";
import { Col, Gap, Row } from "@/ui/layouts";
import { IconLeftBrackets } from "@/components/svgs/IconLeftBrackets";
import { Text } from "@/ui/texts";
// import { AddEnglishEpisodeUrl } from "@/app/[locale]/webtoons/[webtoonId]/episodes/[episodeId]/AddEnglishEpisodeUrl";
// import { DownloadEpisodeImage } from "@/app/[locale]/webtoons/[webtoonId]/episodes/[episodeId]/DownloadEpisodeImage";
import { buildImgUrl } from "@/utils/media";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.service";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import NavBanner from "@/app/[locale]/webtoons/[webtoonId]/episodes/[episodeId]/EpisodeNavBanner";

export default async function WebtoonEpisodeDetail(
  { params }:
  {params: Promise<{webtoonId: string, episodeId: string}>},
) {
  const { episodeId, webtoonId } = await params;
  const episode = await getEpisode(Number(episodeId));
  const { webtoon } = episode;

  const locale = await getLocale();
  const t = await getTranslations("detailedInfoPage");

  const webtoonTitle = locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title;

  return (
    <PageLayout className="flex flex-row items-stretch">
      <div className="flex-1 flex justify-center">
        <NavBanner
          webtoonId={webtoon.id}
          episodeId={episode.navigation.previousId}
        >
          <IconLeftBrackets className="fill-white"/>
          <span>이전화 보기</span>
        </NavBanner>
      </div>
      <div className="max-w-[800px] w-full h-auto min-h-screen">
        <Row>
          <Link href={`/webtoons/${webtoon.id}`}>
            <IconLeftBrackets className="fill-white" />
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

        {/*<Gap y={10} />*/}

        <Row className="justify-between">
          <p className="text-xl font-bold">
            {locale === "ko" ? episode.title : episode.title_en ?? episode.title}
          </p>
          {/*{(webtoon!.authorId === user.id || user.adminLevel > 0) && (*/}
          {/*  <Link href={`/webtoons/${webtoon.id}/episodes/${episode.id}/update`}>*/}
          {/*    <Pencil1Icon className="text-mint" width={25} height={25} />*/}
          {/*    <Gap x={1} />*/}
          {/*    <Text className="text-mint">{t("goEdit")}</Text>*/}
          {/*  </Link>*/}
          {/*)}*/}
        </Row>

        <Gap y={4} />
        <Col>
          {episode.images.map((image) => {
            return (
              <img
                key={image.id}
                src={buildImgUrl(null, image.path)}
                alt={image.path}
              />
            );
          })}
        </Col>
      </div>
      <div className="flex-1 flex justify-center">
        <NavBanner
          webtoonId={webtoon.id}
          episodeId={episode.navigation.nextId}
        >
          <span>다음화 보기</span>
          <IconRightBrackets className="fill-white" />
        </NavBanner>
      </div>

    </PageLayout>
  );
}

