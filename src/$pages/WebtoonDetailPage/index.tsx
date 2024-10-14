"use client";

import React, { useContext } from "react";
import { Container, Row, Gap } from "@/ui/layouts";
import { WebtoonDetail } from "./WebtoonDetail";
import { WebtoonEpisodeList } from "./WebtoonEpisodeList";
import { Text } from "@/ui/texts";
import { IconCross } from "@/components/svgs/IconCross";
import { useTranslations } from "next-intl";
import { ContractRangeData } from "./ContractRangeData";
import { useRouter } from "@/i18n/routing";
import { getServerUserInfo } from "@/utils/auth/server";
import type { WebtoonT } from "@backend/types/Webtoon";

type WebtoonDetailPageProps = {
  webtoon: WebtoonT,
}

export function WebtoonDetailPage({
  webtoon
}: WebtoonDetailPageProps) {
  const router = useRouter();
  const user = getServerUserInfo();
  const editable = webtoon.authorId == user.id;
  const t = useTranslations("detailedInfoPage");

  return (
    <Container className="max-w-[1000px] text-white">
      <Gap y={20} />
      <WebtoonDetail
        webtoon={webtoon}
        editable={editable}
      />

      {
        user.id === webtoon.authorId || user.type === "buyer" ?
          webtoon.bidRounds
        && webtoon.bidRounds.length > 0
        && <ContractRangeData webtoon={webtoon} /> : null
      }

      <Gap y={10} />
      <hr className="border-gray-shade"/>

      <Gap y={10} />
      {
        // TODO: Move to the server side
        // me?.creator?.userId === webtoon.authorId || me?.buyer ?
        1 == 1 && <>
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
        </>
      }
    </Container>
  );
}
