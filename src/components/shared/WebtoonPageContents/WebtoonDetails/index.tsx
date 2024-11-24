import Image from "next/image";
import { Row, Col } from "@/components/ui/common";
import { buildImgUrl } from "@/utils/media";
import { Badge } from "@/shadcn/ui/badge";
import { Link } from "@/i18n/routing";
import { TargetAge } from "@/resources/webtoons/dtos/webtoon.dto";
import WebtoonDetailsButtons from "@/components/shared/WebtoonPageContents/WebtoonDetails/WebtoonDetailsButtons";
import WebtoonDetailsLikeButton from "@/components/shared/WebtoonPageContents/WebtoonDetails/WebtoonDetailsLikeButton";
import { IconLink } from "@/components/svgs/IconLink";
import { useTranslations } from "next-intl";
import EditLink from "@/components/ui/EditLink";
import { clsx } from "clsx";
import { WebtoonDetailsExtendedT } from "@/resources/webtoons/dtos/webtoonDetails.dto";
import { BidRequestDetailsT } from "@/resources/bidRequests/dtos/bidRequest.dto";

type WebtoonDetailsProps = {
  webtoon: WebtoonDetailsExtendedT;
  context: "WebtoonView";
} | {
  webtoon: BidRequestDetailsT["webtoon"];
  context: "InvoiceView";
};
type Webtoon = WebtoonDetailsExtendedT | BidRequestDetailsT["webtoon"];

export default function WebtoonDetails({ webtoon, context }: WebtoonDetailsProps) {
  return (
    <Row className="items-center md:items-start md:flex-row md:justify-start gap-12">
      <Image
        src={buildImgUrl(webtoon.thumbPath, { size: "md" })}
        alt={webtoon.thumbPath}
        width={300}
        height={450}
        // style={{ objectFit: "cover" }}
        priority={true}
        className="rounded-sm"
      />

      <Col className="flex-1 my-auto">

        {/*웹툰 상세보기에서만 노출*/}
        {context === "WebtoonView"
          && <WebtoonDetailsLikeButton
            hasRightToOffer={webtoon.hasRightToOffer}
            initWebtoonLike={{
              webtoonId: webtoon.id,
              likeCount: webtoon.likeCount,
              myLike: webtoon.myLike
            }}/>}

        <Row className="mt-7 justify-between">
          <p className="text-2xl">
            {webtoon.localized.title}
          </p>

          {/*웹툰 상세보기에서만 노출*/}
          {context === "WebtoonView"
          && <EditLink isVisible={webtoon.isEditable}
            href={`/webtoons/${webtoon.id}/update`}/>}

        </Row>
        <ExtraInfoRow webtoon={webtoon} className="mt-4"/>
        <Row className="mt-4">
          <p className="text-sm">
            {webtoon.localized.description}
          </p>
        </Row>
        {webtoon.externalUrl
          && <Row className="mt-5">
            <IconLink className="flex-shrink-0"/>
            <Link href={webtoon.externalUrl}
              className="ml-4 text-[#0075FF] hover:text-[#0075FF]/70 underline text-sm">
              {webtoon.externalUrl}
            </Link>
          </Row>}

        {/*웹툰 상세보기에서만 노출*/}
        {context === "WebtoonView"
          && <WebtoonDetailsButtons
            webtoon={webtoon}
            className="mt-7" />}

        <Genres webtoon={webtoon} className="mt-12" />
      </Col>
    </Row>
  );
}

function Genres({ webtoon, className }: {
  webtoon: Webtoon;
  className?: string;
}) {
  if (webtoon.genres.length === 0) {
    return null;
  }
  return <Row className={clsx(className, "flex-wrap gap-2 content-stretch")}>
    {(webtoon.genres).map((item) => (
      <Badge key={item.id} variant="grayDark">
        {item.localized.label}
      </Badge>
    ))}
  </Row>;
}

function ExtraInfoRow({ webtoon, className }: {
  webtoon: Webtoon;
  className?: string;
}) {
  const t = useTranslations("webtoonDetails");
  const tAgeRestriction = useTranslations("ageRestriction");

  const getTargetAge = () => {
    const numericAges = formatTargetAge(webtoon.targetAges);
    if (numericAges?.length === 1) {
      return t("targetAge", {
        age: numericAges[0]
      });
    } else if (numericAges) {
      return t("targetAgeRanged", {
        lowerLimit: numericAges[0],
        upperLimit: numericAges[numericAges.length - 1],
      });
    }
  };

  const getWebtoonCount = () => {
    if (!webtoon.activeBidRound) {
      return;
    }
    if (webtoon.activeBidRound.isNew) {
      const { currentEpisodeNo } = webtoon.activeBidRound;
      if (currentEpisodeNo) {
        return t("currentEpisodeCount", {
          count: currentEpisodeNo
        });
      }
    } else {
      const { totalEpisodeCount } = webtoon.activeBidRound;
      if (totalEpisodeCount) {
        return t("episodeCount", {
          count: totalEpisodeCount
        });
      }
    }
  };

  const infoArray = [
    // 작가
    webtoon.localized.authorOrCreatorName,

    // 총 에피소드
    getWebtoonCount(),

    // 연령 제한
    tAgeRestriction(webtoon.ageLimit),

    // 타겟 연령
    getTargetAge()
  ];

  return <Row className={clsx(className, "gap-2")}>
    {infoArray.filter(p => !!p).join(" | ")}
  </Row>;
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
