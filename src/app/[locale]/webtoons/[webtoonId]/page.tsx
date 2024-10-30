import React from "react";
import { Link } from "@/i18n/routing";
import { Gap, Row } from "@/ui/layouts";
import { ContractRangeData } from "@/app/[locale]/webtoons/[webtoonId]/ContractRangeData";
import { IconCross } from "@/components/svgs/IconCross";
import { Text } from "@/ui/texts";
import { WebtoonEpisodeList } from "@/app/[locale]/webtoons/[webtoonId]/WebtoonEpisodeList";
import { getTranslations } from "next-intl/server";
import { getWebtoon } from "@/resources/webtoons/webtoon.service";
import { UserTypeT } from "@/resources/users/user.types";
import WebtoonDetails from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetails";
import PageLayout from "@/components/PageLayout";
import { getUserMetadata } from "@/resources/userMetadata/userMetadata.service";

export default async function WebtoonInfo({ params }:
{ params: Promise<{ webtoonId: string }> }) {
  const { webtoonId } = await params;
  const webtoon = await getWebtoon(Number(webtoonId));
  const user = await getUserMetadata();
  const isOwner = user.type === UserTypeT.Creator
    && webtoon.authorId === user.creatorId;
  const t = await getTranslations("detailedInfoPage");

  return (
    <PageLayout>
      <WebtoonDetails
        webtoon={webtoon}
        editable={isOwner}
      />

      {
        webtoon.bidRounds?.length
          && <ContractRangeData webtoon={webtoon}/>
      }

      <Gap y={10}/>
      <hr className="border-gray-shade"/>

      {
        <>
          <Gap y={10}/>
          <Row className="justify-between">
            <p className='text-2xl font-bold'>{t("episodePreview")}</p>

            <Gap x={4}/>

            {isOwner && (
              <Link className="cursor-pointer"
                href={`/webtoons/${webtoon.id}/episodes/create`}>
                <IconCross className="fill-mint"/>
                <Text className="text-mint">{t("addEpisode")}</Text>
              </Link>
            )}

          </Row>
        </>
      }
    </PageLayout>
  );
}
