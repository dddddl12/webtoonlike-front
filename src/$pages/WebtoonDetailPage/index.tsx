"use client";

import React from "react";
import { Container, Row, Gap } from "@/ui/layouts";
import { WebtoonDetail } from "./WebtoonDetail";
import { WebtoonEpisodeList } from "./WebtoonEpisodeList";
import { useMe } from "@/states/UserState";
import { Text } from "@/ui/texts";
import { IconCross } from "@/components/svgs/IconCross";
import type { WebtoonT } from "@/types";
import { useTranslations } from "next-intl";
import { ContractRangeData } from "./ContractRangeData";
import { useRouter } from "next/navigation";

type WebtoonDetailPageProps = {
  webtoon: WebtoonT,
}

export function WebtoonDetailPage({
  webtoon
}: WebtoonDetailPageProps) {
  const router = useRouter();
  const me = useMe();
  const editable = webtoon.authorId == me?.id;
  const t = useTranslations("detailedInfoPage");

  return (
    <Container className="max-w-[1000px] text-white">
      <Gap y={20} />
      <WebtoonDetail
        webtoon={webtoon}
        editable={editable}
      />

      {
        me?.creator?.userId === webtoon.authorId || me?.buyer ?
          webtoon.bidRounds
        && webtoon.bidRounds.length > 0
        && <ContractRangeData webtoon={webtoon} /> : null
      }

      <Gap y={10} />
      <hr className="border-gray-shade"/>

      <Gap y={10} />
      {
        me?.creator?.userId === webtoon.authorId || me?.buyer ?
          <>
            <Row className="justify-between">
              <p className='text-2xl font-bold'>{t("episodePreview")}</p>

              <Gap x={4} />

              {editable && (
                <Row className="cursor-pointer" onClick={() => {router.push(`/webtoons/${webtoon.id}/episodes/create`);}}>
                  <IconCross className="fill-mint" />
                  <Text className="text-mint">{t("addEpisode")}</Text>
                </Row>
              )}

            </Row>

            <Gap y={4} />

            <WebtoonEpisodeList
              webtoon={webtoon}
              editable={editable}
            />
            <Gap y={20} />
          </> : null
      }
    </Container>
  );
}
