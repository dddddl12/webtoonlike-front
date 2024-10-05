"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Row, Col, Gap } from "@/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import { Text } from "@/ui/texts";
import { LeftTimeInfo } from "@/components/LeftTimeInfo";
import { Badge } from "@/ui/shadcn/Badge";
import { WebtoonDetailBtns } from "./WebtoonDetailBtns";
import { extractAuthorName, extractAuthorNameEn } from "@/utils/webtoon";
import type { WebtoonT } from "@/types";
import { intervalToDuration ,format as dfFormat } from "date-fns";
import { useRouter } from "next/navigation";

type WebtoonDetailProps = {
  webtoon: WebtoonT;
  editable?: boolean;
};

export function WebtoonDetail({ webtoon, editable }: WebtoonDetailProps) {
  const router = useRouter();
  const t = useTranslations("detailedInfoPage");
  const Tdetails = useTranslations("detailedInfoPage");
  const locale = useLocale();

  function hasBidStartAtPassed() {
    if (webtoon.bidRounds && webtoon.bidRounds.length > 0 && webtoon.bidRounds[0].bidStartAt) {
      const now = new Date();
      const bidStartAt = new Date(webtoon.bidRounds[0].bidStartAt);
      return bidStartAt < now;
    } else return false;
  }

  function getLeftTime() {
    if (webtoon.bidRounds && webtoon.bidRounds.length > 0 && webtoon.bidRounds[0].negoStartAt) {
      const now = new Date();
      const bidEndAt = new Date(webtoon.bidRounds[0].negoStartAt);
      const { days, hours, minutes } = intervalToDuration({ start: now, end: bidEndAt });

      return `${days}일 ${hours}시간 ${minutes}분`;
    } else return "";
  }

  function isBidStartAtExist() {
    return !!(webtoon.bidRounds && webtoon.bidRounds.length > 0 && webtoon.bidRounds[0].bidStartAt);
  }

  return (
    <Col className="justify-center items-center md:items-start md:flex-row md:justify-start">
      <Col className="rounded-sm min-w-[300px] min-h-[450px] justify-center bg-gray-darker">
        {webtoon.thumbPath == null ? (
          <div className="w-[300px] h-[450px] rounded-md bg-gray" />
        ) : (
          <div className="w-[300px] h-[450px] overflow-hidden relative rounded-sm">
            <Image
              src={webtoon.thumbPath ? buildImgUrl(null, webtoon.thumbPath, { size: "md" }) : "/img/webtoon_default_image.svg"}
              alt={`${webtoon?.thumbPath}`}
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
        )}
      </Col>

      <Gap y={20} />

      <Col className="ml-[20px] justify-center my-auto w-full">
        {!hasBidStartAtPassed()
          && !isBidStartAtExist() ? null : <LeftTimeInfo time={getLeftTime()} headCount={webtoon.numRequest ? webtoon.numRequest : 0}/>}
        <Gap y={10} />
        <Col>
          <Row className="justify-between">
            <Text className="text-white text-[24pt]">{locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title} </Text>
            {editable && (
              <Row className="cursor-pointer" onClick={() => {router.push(`/webtoons/${webtoon.id}/update`);}}>
                <Pencil1Icon width={25} height={25} className="text-mint" />
                <Gap x={2} />
                <Text className="text-mint">{t("goEdit")}</Text>
              </Row>
            )}
          </Row>
          <Gap y="16px" />
          <Row>
            <Text className="text-[16pt] text-white">
              {locale === "ko" ? extractAuthorName(webtoon) ?? "알 수 없음" : extractAuthorNameEn(webtoon) ?? "Unknown"}
            </Text>
            <Gap x={4} />
            <Text className="text-[16pt] text-white">|</Text>
            <Gap x={4} />
            <Text className="text-[16pt] text-white">
              {webtoon?.ageLimit ? webtoon.ageLimit : (locale === "ko" ? "전체이용가" : "ALL")}
            </Text>
          </Row>
          <Gap y="16px" />
          <Text className="text-[12pt] text-white line-clamp-5">{locale === "ko" ? webtoon.description : webtoon.description_en ?? webtoon.description}</Text>
          <Gap y="16px" />
          <Row className="flex-wrap gap-2 content-stretch">
            {(webtoon.genres ?? []).map((item) => (
              <Badge key={item.id} className="bg-gray-dark text-white">
                {locale === "ko" ? item.label : item.label_en ?? item.label}
              </Badge>
            ))}
          </Row>
          <Gap y="52px" />
          <WebtoonDetailBtns webtoon={webtoon} />
        </Col>
      </Col>
    </Col>
  );
}
