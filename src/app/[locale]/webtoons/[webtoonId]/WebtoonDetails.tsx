import Image from "next/image";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Row, Col, Gap } from "@/shadcn/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import { Text } from "@/shadcn/ui/texts";
import { Badge } from "@/shadcn/ui/badge";
import { Link } from "@/i18n/routing";
import { TargetAge, WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import { getLocale, getTranslations } from "next-intl/server";
import WebtoonDetailsButtons from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetailsButtons";
import WebtoonDetailsLikeButton from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetailsLikeButton";
import { IconLink } from "@/components/svgs/IconLink";
import { displayName } from "@/utils/displayName";

export default async function WebtoonDetails({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const t = await getTranslations("webtoonDetails");
  const tGeneral = await getTranslations("general");
  const tAgeRestriction = await getTranslations("ageRestriction");
  const targetAge = await formatTargetAge(webtoon.targetAges);
  const locale = await getLocale();

  return (
    <Row className="items-center md:items-start md:flex-row md:justify-start gap-12">
      <Image
        src={buildImgUrl(webtoon.thumbPath, { size: "md" })}
        alt={webtoon.thumbPath}
        width={300}
        height={450}
        style={{ objectFit: "cover" }}
        priority={true}
        className="rounded-sm"
      />

      <Col className="flex-1 my-auto">
        <WebtoonDetailsLikeButton initWebtoonLike={{
          webtoonId: webtoon.id,
          likeCount: webtoon.likeCount,
          myLike: webtoon.myLike
        }} />
        <Gap y={7.5} />
        <Col>
          <Row className="justify-between">
            <Text className="text-white text-2xl">
              {displayName(locale, webtoon.title, webtoon.title_en)}
            </Text>
            {webtoon.isEditable && (
              <Link
                className="flex items-center gap-2 text-mint"
                href={`/webtoons/${webtoon.id}/update`}
              >
                <Pencil1Icon width={25} height={25} />
                <Text>{tGeneral("edit")}</Text>
              </Link>
            )}
          </Row>
          <Gap y={4} />
          <Row className="gap-2">
            {/* 작가 */}
            <Text className="text-base text-white">
              {displayName(locale, webtoon.authorOrCreatorName, webtoon.authorOrCreatorName_en)}
            </Text>
            {/* 총 에피소드 */}
            {webtoon.bidRound?.totalEpisodeCount && <>
              <Text className="text-base text-white">|</Text>
              <Text className="text-base text-white">
                {t("episodeCount", {
                  count: webtoon.bidRound.totalEpisodeCount
                })}
              </Text>
            </>}
            {/* 연령 제한 */}
            <Text className="text-base text-white">|</Text>
            <Text className="text-base text-white">
              {tAgeRestriction(webtoon.ageLimit)}
            </Text>
            {/* 타겟 연령 TODO */}
            {targetAge && <>
              <Text className="text-base text-white">|</Text>
              <Text className="text-base text-white">
                {targetAge}
              </Text>
            </>}
          </Row>
          <Gap y={4} />
          <Text className="text-sm text-white">
            {displayName(locale, webtoon.description, webtoon.description_en)}
          </Text>
          <ExternalLink webtoon={webtoon} />
          <Gap y={7} />
          <WebtoonDetailsButtons webtoon={webtoon} />
          <Genres webtoon={webtoon} />
        </Col>
      </Col>
    </Row>
  );
}

async function ExternalLink({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const locale = await getLocale();
  const link = locale === "ko"
    ? webtoon.externalUrl
    : webtoon.englishUrl ?? webtoon.externalUrl;
  if (!link) {
    return null;
  }
  return <>
    <Gap y={5} />
    <Row>
      <IconLink/>
      <Link href={link} className="ml-4 text-[#0075FF] underline text-sm">{link}</Link>
    </Row>
  </>;
}

async function Genres({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const locale = await getLocale();
  if (webtoon.genres.length === 0) {
    return null;
  }
  return <>
    <Gap y={13} />
    <Row className="flex-wrap gap-2 content-stretch">
      {(webtoon.genres).map((item) => (
        <Badge key={item.id} className="bg-gray-dark text-white">
          {displayName(locale, item.label, item.label_en)}
        </Badge>
      ))}
    </Row>
  </>;
}

async function formatTargetAge(targetAges: TargetAge[]) {
  const t = await getTranslations("webtoonDetails");
  if (targetAges.length === 0) {
    return undefined;
  }
  const numericAges = targetAges.map(age => {
    switch (age) {
    case TargetAge.Teens:
      return 10;
    case TargetAge.Twenties:
      return 20;
    case TargetAge.Thirties:
      return 30;
    case TargetAge.Forties:
      return 40;
    case TargetAge.Fifties:
      return 50;
    default:
      throw new Error(`Unknown age ${targetAges.join(",")}`);
    }
  }).sort((a, b) => a - b);
  if (numericAges.length === 1) {
    return t("targetAge", {
      age: numericAges[0]
    });
  } else {
    return t("targetAgeRanged", {
      lowerLimit: numericAges[0],
      upperLimit: numericAges[numericAges.length - 1],
    });
  }
}