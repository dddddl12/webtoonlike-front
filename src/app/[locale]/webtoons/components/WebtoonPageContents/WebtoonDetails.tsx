import Image from "next/image";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Row, Col, Gap } from "@/shadcn/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import { Text } from "@/shadcn/ui/texts";
import { Badge } from "@/shadcn/ui/badge";
import { Link } from "@/i18n/routing";
import { TargetAge, WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import WebtoonDetailsButtons from "@/app/[locale]/webtoons/components/WebtoonPageContents/WebtoonDetailsButtons";
import WebtoonDetailsLikeButton from "@/app/[locale]/webtoons/components/WebtoonPageContents/WebtoonDetailsLikeButton";
import { IconLink } from "@/components/svgs/IconLink";
import { displayName } from "@/utils/displayName";
import { useLocale, useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

export default function WebtoonDetails({ webtoon, openBidRequestForm, setOpenBidRequestForm }: {
  webtoon: WebtoonExtendedT;
  openBidRequestForm: boolean;
  setOpenBidRequestForm: Dispatch<SetStateAction<boolean>>;
}) {
  const tGeneral = useTranslations("general");
  const locale = useLocale();

  return (
    <Row className="items-center md:items-start md:flex-row md:justify-start gap-12">
      <Image
        src={buildImgUrl(webtoon.thumbPath, { size: "md" })}
        alt={webtoon.thumbPath}
        width={300}
        height={45}
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
            {/*TODO gap 및 Text 모두 제거*/}
            <Text className="text-2xl">
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
            <Text className="text-base">
              <ExtraInfoRow webtoon={webtoon} />
            </Text>
          </Row>
          <Gap y={4} />
          <Text className="text-sm">
            {displayName(locale, webtoon.description, webtoon.description_en)}
          </Text>
          <ExternalLink webtoon={webtoon} />
          {!openBidRequestForm && <>
            <Gap y={7} />
            <WebtoonDetailsButtons webtoon={webtoon} setOpenBidRequestForm={setOpenBidRequestForm} />
          </>}
          <Genres webtoon={webtoon} />
        </Col>
      </Col>
    </Row>
  );
}

function ExternalLink({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const link = webtoon.externalUrl;
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

function Genres({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const locale = useLocale();
  if (webtoon.genres.length === 0) {
    return null;
  }
  return <>
    <Gap y={13} />
    <Row className="flex-wrap gap-2 content-stretch">
      {(webtoon.genres).map((item) => (
        <Badge key={item.id} className="bg-gray-dark">
          {displayName(locale, item.label, item.label_en)}
        </Badge>
      ))}
    </Row>
  </>;
}

function ExtraInfoRow({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const t = useTranslations("webtoonDetails");
  const tAgeRestriction = useTranslations("ageRestriction");
  const locale = useLocale();

  const numericAges = formatTargetAge(webtoon.targetAges);
  let targetAge = "";
  if (numericAges?.length === 1) {
    targetAge = t("targetAge", {
      age: numericAges[0]
    });
  } else if (numericAges) {
    targetAge = t("targetAgeRanged", {
      lowerLimit: numericAges[0],
      upperLimit: numericAges[numericAges.length - 1],
    });
  }

  const infoArray = [
    // 작가
    displayName(locale, webtoon.authorOrCreatorName, webtoon.authorOrCreatorName_en),

    // 총 에피소드 TODO 연재중인 경우라면?
    webtoon.activeBidRound?.totalEpisodeCount !== undefined ? t("episodeCount", {
      count: webtoon.activeBidRound.totalEpisodeCount
    }) : undefined,

    // 연령 제한
    tAgeRestriction(webtoon.ageLimit),

    // 타겟 연령
    targetAge
  ];

  return <>
    {infoArray.filter(p => !!p).join(" | ")}
  </>;
}


function formatTargetAge(targetAges: TargetAge[]) {
  if (targetAges.length === 0) {
    return undefined;
  }
  return targetAges.map(age => {
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
}
