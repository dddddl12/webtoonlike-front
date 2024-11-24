import PageLayout from "@/components/ui/PageLayout";
import { Col, Row } from "@/components/ui/common";
import { IconLeftBrackets } from "@/components/svgs/IconLeftBrackets";
import WebtoonEpisodeEnglishUrlForm from "@/components/forms/WebtoonEpisodeEnglishUrlForm";
import DownloadEpisodeImage from "@/app/[locale]/webtoons/[webtoonId]/episodes/[episodeId]/DownloadEpisodeImage";
import { buildImgUrl } from "@/utils/media";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getEpisode } from "@/resources/webtoonEpisodes/webtoonEpisode.controller";
import Image from "next/image";
import NavButton from "@/app/[locale]/webtoons/[webtoonId]/episodes/[episodeId]/EpisodeNavButton";
import { responseHandler } from "@/handlers/responseHandler";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { AdminLevel } from "@/resources/tokens/token.types";
import EditLink from "@/components/ui/EditLink";

export default async function WebtoonEpisodeDetail(
  { params }:
  {params: Promise<{webtoonId: string; episodeId: string}>}
) {
  const { webtoonId, episodeId } = await params
    .then(({ webtoonId, episodeId }) => ({
      webtoonId: Number(webtoonId),
      episodeId: Number(episodeId)
    }));
  const episode = await getEpisode(webtoonId, episodeId)
    .then(responseHandler);
  const { webtoon } = episode;

  const t = await getTranslations("episodePage");
  const { metadata } = await getTokenInfo();

  return (
    <PageLayout>
      <div className="flex flex-row items-stretch gap-4">
        <div className="flex-1 flex justify-center">
          <NavButton
            webtoonId={webtoon.id}
            episodeId={episode.navigation.previousId}
            direction="previous"
          />
        </div>
        <div className="max-w-[800px] w-full h-auto">
          <Row>
            <Link href={`/webtoons/${webtoon.id}`}>
              <IconLeftBrackets className="fill-white" />
            </Link>
            <p className="text-3xl font-bold ml-4 flex-1">
              {`${webtoon.localized.title} _ ${t("episodeSeq", {
                number: episode.episodeNo
              })}`}
            </p>
            <EditLink
              href={`/webtoons/${webtoon.id}/episodes/${episode.id}/update`}
              isVisible={episode.isEditable}
            />
          </Row>

          {metadata.adminLevel >= AdminLevel.Admin
            && <Col className="mt-10 gap-4">
              <p className="text-xl font-bold">{t("administratorFeatures.title")}</p>
              <WebtoonEpisodeEnglishUrlForm episode={episode}/>
              <DownloadEpisodeImage episode={episode}/>
            </Col>}

          <Col className="mt-4">
            {episode.imagePaths.map((imagePath, i) => {
              return (
                <Image
                  key={i}
                  src={buildImgUrl(imagePath)}
                  alt={imagePath}
                  width={800}
                  height={0}
                  style={{ objectFit: "cover" }}
                />
              );
            })}
          </Col>
        </div>
        <div className="flex-1 flex justify-center">
          <NavButton
            webtoonId={webtoon.id}
            episodeId={episode.navigation.nextId}
            direction="next"
          />
        </div>
      </div>
    </PageLayout>
  );
}

