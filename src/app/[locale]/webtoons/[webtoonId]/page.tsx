import React from "react";
import { Link } from "@/i18n/routing";
import { Gap, Row } from "@/ui/layouts";
import { ContractRangeData } from "@/app/[locale]/webtoons/[webtoonId]/ContractRangeData";
import { IconCross } from "@/components/svgs/IconCross";
import { Text } from "@/ui/texts";
import { WebtoonEpisodeList } from "@/app/[locale]/webtoons/[webtoonId]/WebtoonEpisodeList";
import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/utils/auth/server";
import { getWebtoon } from "@/resources/webtoons/webtoon.service";
import { UserTypeT } from "@/resources/users/user.types";
import WebtoonDetails from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetails";
import PageLayout from "@/components/PageLayout";

export default async function WebtoonInfo({ params }:
{ params: Promise<{ webtoonId: string }> }) {
  const { webtoonId } = await params;
  const webtoon = await getWebtoon(Number(webtoonId));
  const user = await getUserInfo();
  const editable = webtoon.authorId === user.id; //TODO creator ID 비교로 변경
  // TODO 서버에서 미리 파악해서 주는 것 고려
  const contractInfoDisclosed = editable || user.type === UserTypeT.Buyer;
  const t = await getTranslations("detailedInfoPage");

  return (
    <PageLayout>
      <WebtoonDetails
        webtoon={webtoon}
        editable={editable}
      />

      {
        contractInfoDisclosed && webtoon.bidRounds?.length
          && <ContractRangeData webtoon={webtoon}/>
      }

      <Gap y={10}/>
      <hr className="border-gray-shade"/>

      {
        contractInfoDisclosed && <>
          <Gap y={10}/>
          <Row className="justify-between">
            <p className='text-2xl font-bold'>{t("episodePreview")}</p>

            <Gap x={4}/>

            {editable && (
              <Link className="cursor-pointer"
                href={`/webtoons/${webtoon.id}/episodes/create`}>
                <IconCross className="fill-mint"/>
                <Text className="text-mint">{t("addEpisode")}</Text>
              </Link>
            )}

          </Row>

          <Gap y={4}/>

          <WebtoonEpisodeList
            webtoon={webtoon}
            editable={editable}
          />
        </>
      }
    </PageLayout>
  );
}
