import { BidRequestDetailsT, getBidRequest } from "@/resources/bidRequests/bidRequest.service";
import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import OfferDetails from "@/components/Details/OfferDetails";
import { useEffect, useMemo, useState } from "react";
import Spinner from "@/components/Spinner";
import Profile from "@/components/Details/Profile";
import { displayName } from "@/utils/displayName";
import { useLocale, useTranslations } from "next-intl";
import { TargetAge } from "@/resources/webtoons/webtoon.types";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { Text } from "@/shadcn/ui/texts";
import { Link } from "@/i18n/routing";
import { IconLink } from "@/components/svgs/IconLink";
import { Badge } from "@/shadcn/ui/badge";
import useSafeAction from "@/hooks/safeAction";

export default function BidRequestDetailsForInvoice({ bidRequestId }: {
  bidRequestId: number;
}) {
  const [bidRequest, setBidRequest] = useState<BidRequestDetailsT>();
  const boundGetBidRequest = useMemo(() => getBidRequest.bind(null, bidRequestId), [bidRequestId]);
  const { execute } = useSafeAction(boundGetBidRequest, {
    onSuccess: ({ data }) => setBidRequest(data)
  });
  useEffect(() => {
    execute();
  }, [execute]);

  if (!bidRequest) {
    return <Spinner/>;
  }

  return <Col className="gap-10 bg-[#403F3F] p-5 rounded-[10px] mb-2">
    <WebtoonDetailsForInvoice webtoon={bidRequest.webtoon}/>
    <Row>
      <CreatorProfile creator={bidRequest.creator} />
      <BuyerProfile buyer={bidRequest.buyer} />
    </Row>
    <hr className="border-gray-dark"/>
    <OfferDetails
      contractRange={bidRequest.contractRange}
      message={bidRequest.message} />
  </Col>;
}

function CreatorProfile({ creator }: {
  creator: BidRequestDetailsT["creator"];
}) {
  const locale = useLocale();
  const creatorName = displayName(locale, creator.name, creator.name_en);
  const affiliatedDisplay = creator.isAgencyAffiliated ? "에이전시 소속" : "개인";
  const { user } = creator;
  return <Profile
    name={user.name + "(판매자)"}
    title={[affiliatedDisplay, creatorName].join(" / ")}
    thumbPath={user.thumbPath}
    phone={user.phone}
    email={user.email}
    className="flex-1"
  />;
}

function BuyerProfile({ buyer }: {
  buyer: BidRequestDetailsT["buyer"];
}) {
  const { user } = buyer;
  return <Profile
    name={user.name + "(구매자)"}
    title={[buyer.name, buyer.dept, buyer.position].join(" / ")}
    thumbPath={user.thumbPath}
    phone={user.phone}
    email={user.email}
    className="flex-1"
  />;
}


// TODO 웹툰 페이지와 통합
function WebtoonDetailsForInvoice({ webtoon }: {
  webtoon: BidRequestDetailsT["webtoon"];
}) {
  const locale = useLocale();

  return (
    <Row className="items-center md:items-start md:flex-row md:justify-start gap-12">
      <Image
        src={buildImgUrl(webtoon.thumbPath, { size: "md" })}
        alt={webtoon.thumbPath}
        width={150}
        height={225}
        style={{ objectFit: "cover" }}
        priority={true}
        className="rounded-sm"
      />

      <Col className="flex-1 my-auto">
        <Col>
          <Row className="justify-between">
            {/*TODO gap 및 Text 모두 제거*/}
            <Text className="text-2xl">
              {displayName(locale, webtoon.title, webtoon.title_en)}
            </Text>
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
          {/*<Genres webtoon={webtoon} />*/}
        </Col>
      </Col>
    </Row>
  );
}

function ExternalLink({ webtoon }: {
  webtoon: BidRequestDetailsT["webtoon"];
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
  webtoon: BidRequestDetailsT["webtoon"];
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
  webtoon: BidRequestDetailsT["webtoon"];
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
