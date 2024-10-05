"use client";

import React, { useEffect, Fragment } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { WebtoonEpisodePreview } from "./WebtoonEpisodePreview";
import { useListData } from "@/hooks/ListData";
import { ListView } from "@/ui/tools/ListView";
import * as WebtoonEpisodeApi from "@/apis/webtoon_episodes";
import type { WebtoonT, ListWebtoonEpisodeOptionT } from "@/types";
import { useMe } from "@/states/UserState";
import Spinner from "@/components/Spinner";
import { useTranslations, useLocale } from "next-intl";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useRouter } from "next/navigation";

type WebtoonEpisodeListProps = {
  webtoon: WebtoonT;
  editable?: boolean;
};

export function WebtoonEpisodeList({
  webtoon,
  editable,
}: WebtoonEpisodeListProps) {
  const router = useRouter();
  const me = useMe();
  const t = useTranslations("episodePreviewDesc");
  const locale = useLocale();
  const { data: webtoonEpisodes$, actions: webtoonEpisodesAct } = useListData({
    // listFn: WebtoonEpisodeApi.list,
    listFn: async (listOpt) => {
      return await WebtoonEpisodeApi.list(listOpt);
    },
  });

  const listOpt: ListWebtoonEpisodeOptionT = {
    webtoonId: webtoon.id,
    limit: 10,
  };

  useEffect(() => {
    webtoonEpisodesAct.load(listOpt);
  }, []);

  function handleLoaderDetect(): void {
    webtoonEpisodesAct.refill();
  }

  const { status, data: episodes } = webtoonEpisodes$;

  if (status == "idle" || status == "loading") {
    return <Spinner />;
  }
  if (status == "error") {
    return <ErrorComponent />;
  }

  return (
    <div>
      {episodes.length == 0 && webtoon.authorId == me?.id && (
        <Row className="justify-center bg-gray-darker p-3 rounded-sm">
          {t("pressAddEps")}
        </Row>
      )}
      {episodes.length == 0 && webtoon.authorId != me?.id && (
        <Row className="justify-center bg-gray-darker p-3 rounded-sm">
          {t("noEps")}
        </Row>
      )}

      <Col>
        <ListView
          data={episodes}
          onLoaderDetect={handleLoaderDetect}
          renderItem={(episode, idx) => {
            return (
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
            );
          }}
          renderAppend={() => {
            if (webtoonEpisodes$.appendingStatus == "loading") {
              return <Spinner />;
            }
            return null;
          }}
        />
      </Col>
    </div>
  );
}
