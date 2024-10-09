"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Button } from "@/ui/shadcn/Button";
import { Badge } from "@/ui/shadcn/Badge";
import { LeftTimeInfo } from "@/components/LeftTimeInfo";
import { IconHeart } from "@/components/svgs/IconHeart";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import { buildImgUrl } from "@/utils/media";
import { extractAuthorName, extractAuthorNameEn } from "@/utils/webtoon";
import { useSnackbar } from "@/hooks/Snackbar";
import * as WebtoonLike from "@/apis/webtoon_likes";
import type { WebtoonT } from "@/types";
import { intervalToDuration } from "date-fns";
import { useRouter } from "@/i18n/routing";


type PopularCarouselItemProps = {
  webtoon: WebtoonT,
  onUpdateSuccess: (newWebtoon: WebtoonT) => void,
}

export function PopularCarouselItem({
  webtoon,
  onUpdateSuccess,
}: PopularCarouselItemProps) {
  const router = useRouter();
  const t = useTranslations("homeMain");
  const { enqueueSnackbar } = useSnackbar();
  const locale = useLocale();

  async function handleClickLike(): Promise<void> {
    // TODO
    // if (!me) {
    //   enqueueSnackbar("로그인이 필요합니다.", { variant: "warning" });
    //   return;
    // }
    try {
      const created = await WebtoonLike.create({
        webtoonId: webtoon.id
      });
      const newWebtoon: WebtoonT = { ...webtoon, myLike: created };
      onUpdateSuccess(newWebtoon);
    } catch (e){
      enqueueSnackbar("알 수 없는 에러가 발생했습니다.", { variant: "warning" });
    }
  }

  async function handleClickUnlike(): Promise<void> {
    // TODO
    // if (!me) {
    //   enqueueSnackbar("로그인이 필요합니다.", { variant: "warning" });
    //   return;
    // }
    try {
      if (webtoon.myLike) {
        await WebtoonLike.remove(webtoon.myLike.id);
        const newWebtoon: WebtoonT = { ...webtoon, myLike: undefined };
        onUpdateSuccess(newWebtoon);
      }
    } catch (e){
      enqueueSnackbar("알 수 없는 에러가 발생했습니다.", { variant: "warning" });
    }
  }

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
    <Col className="bg-black-texts xl:w-full xl:h-[550px] p-[44px] rounded-md items-center xl:flex xl:flex-row">
      <Col className="items-center">
        <Col className="w-[260px] h-[390px] justify-center bg-gray-darker">
          {webtoon.thumbPath == null ? (
            <div className='w-[260px] h-[390px] rounded-md bg-gray' />
          ) : (
            <div className="w-[260px] h-[390px] overflow-hidden rounded-md relative">
              <Image
                src={buildImgUrl(null, webtoon.thumbPath, { size: "md" })}
                alt="Item thumbnail"
                fill={true}
              />
            </div>
          )}
        </Col>
      </Col>

      <Gap x="52px" />
      <Gap y="50px" />

      <Col className="w-full h-full justify-between py-5">
        <Col className="text-white">
          {!hasBidStartAtPassed()
          && !isBidStartAtExist() ? null : <LeftTimeInfo time={getLeftTime()} headCount={webtoon.numRequest ? webtoon.numRequest : 0}/>}
          <Gap y="16px" />
          <Text className="text-white text-[24pt]">
            {locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title}
          </Text>
          <Gap y="16px" />
          <Row>
            <Text className="text-[12pt] xl:text-[16px] text-white">
              {locale === "ko" ? extractAuthorName(webtoon) ?? "알 수 없음" : extractAuthorNameEn(webtoon) ?? "Unknown"}
            </Text>
            <Gap x={4} />
            <Text className="text-[12pt] xl:text-[16px] text-white">|</Text>
            <Gap x={4} />
            <Text className="text-[12pt] xl:text-[16px] text-white">{webtoon.ageLimit ? webtoon.ageLimit : (locale === "ko" ? "전체이용가" : "ALL")}</Text>
          </Row>
          <Gap y="16px" />
          <Row className="flex-wrap gap-2 content-stretch">
            {(webtoon.genres ?? []).map((item) => (
              <Badge key={item.id} className="bg-gray-dark text-white">
                {locale === "ko" ? item.label : item.label_en ?? item.label}
              </Badge>
            ))}
          </Row>
          <Gap y="16px" />
          <Text className="text-[12pt] text-white max-h-[80px] overflow-hidden line-clamp-3">
            {locale === "ko" ? webtoon.description : webtoon.description_en ?? webtoon.description}
          </Text>
          <Gap y="52px" />
        </Col>
        <Row className="w-full justify-between">
          <div
            className="w-[85%] h-[48px] flex justify-center items-center bg-red text-white px-0 py-0 rounded-[4px] cursor-pointer"
            onClick={() => {router.push(`/webtoons/${webtoon.id}`);}}>
            {t("viewContent")}
          </div>
          {webtoon.myLike
            ? <Button onClick={handleClickUnlike} className="w-[48px] h-[48px] bg-gray-dark text-white px-0 py-0 rounded-[4px]">
              {/* {webtoon.numLike} */}
              <IconHeartFill fill="red"/>
            </Button>
            : <Button onClick={handleClickLike} className="w-[48px] h-[48px] bg-gray-dark text-white px-0 py-0 rounded-[4px] hover:bg-red">
              {/* {webtoon.numLike} */}
              <IconHeart fill="white" />
            </Button>}
        </Row>
      </Col>
    </Col>
  );
}