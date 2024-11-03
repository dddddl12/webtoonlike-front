import Image from "next/image";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Row, Col, Gap } from "@/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import { Text } from "@/ui/texts";
import { Badge } from "@/ui/shadcn/Badge";
import { Link } from "@/i18n/routing";
import { TargetAge, WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import { getLocale, getTranslations } from "next-intl/server";
import WebtoonDetailsBiddingStatus from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetailsBiddingStatus";
import WebtoonDetailsButtons from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetailsButtons";
import WebtoonDetailsLikeButton from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetailsLikeButton";
import { IconLink } from "@/components/svgs/IconLink";

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
        src={buildImgUrl(null, webtoon.thumbPath, { size: "md" })}
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

        {/*TODO 디자인*/}
        <WebtoonDetailsBiddingStatus bidRound={webtoon.bidRound}/>
        <Col>
          <Row className="justify-between">
            <Text className="text-white text-2xl">
              {locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title}
            </Text>
            {/*TODO*/}
            {webtoon.isMine && (
              <Link
                className="cursor-pointer"
                href={`/webtoons/${webtoon.id}/update`}
              >
                <Pencil1Icon width={25} height={25} className="text-mint" />
                <Gap x={2} />
                <Text className="text-mint">{tGeneral("edit")}</Text>
              </Link>
            )}
          </Row>
          <Gap y={4} />
          <Row className="gap-2">
            {/* 작가 */}
            <Text className="text-base text-white">
              {locale === "ko" ? webtoon.creator.name
                : (webtoon.creator.name_en ?? webtoon.creator.name)}
            </Text>
            {/* 총 에피소드 */}
            {webtoon.bidRound?.episodeCount && <>
              <Text className="text-base text-white">|</Text>
              <Text className="text-base text-white">
                {t("episodeCount", {
                  count: webtoon.bidRound.episodeCount
                })}
              </Text>
            </>}
            {/* 연령 제한 */}
            <Text className="text-base text-white">|</Text>
            <Text className="text-base text-white">
              {tAgeRestriction(webtoon.ageLimit)}
            </Text>
            {/* 타겟 연령 */}
            {targetAge && <>
              <Text className="text-base text-white">|</Text>
              <Text className="text-base text-white">
                {targetAge}
              </Text>
            </>}
          </Row>
          <Gap y={4} />
          <Text className="text-sm text-white">{locale === "ko" ? webtoon.description : webtoon.description_en ?? webtoon.description}</Text>
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
          {locale === "ko" ? item.label : (item.label_en ?? item.label)}
        </Badge>
      ))}
    </Row>
  </>;
}

async function formatTargetAge(targetAges: TargetAge[]) {
  const t = await getTranslations("webtoonDetails");
  if (targetAges.includes(TargetAge.All) || targetAges.length === 0) {
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