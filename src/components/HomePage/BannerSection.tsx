"use client";

import { Col, Row } from "@/components/ui/layouts";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BannerWebtoon, bannerWebtoons } from "@/components/HomePage/banners/bannerData";
import { ReactNode, useEffect, useState } from "react";
import { clsx } from "clsx";
import ClockIcon from "./icons/clock.svg";
import OffersIcon from "./icons/offers.svg";
import BarIcon from "./icons/bar.svg";

export default function BannerSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0);
  const lastIndex = bannerWebtoons.length - 1;

  useEffect(() => {
    let targetIndex = Math.max(activeIndex - 1, 0);
    targetIndex = Math.min(targetIndex, lastIndex - 2);
    setFirstVisibleIndex(targetIndex);
  }, [activeIndex]);

  return (
    <Row className="h-[400px]">
      {bannerWebtoons.map((webtoon, index) => {
        return (
          <Slide
            key={webtoon.id}
            webtoon={webtoon}
            isVisible={firstVisibleIndex <= index && index < firstVisibleIndex + 3}
            isFirstVisible={firstVisibleIndex === index}
            isActive={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          />
        );
      })}
    </Row>
  );
}

function Slide({
  webtoon, isVisible, isFirstVisible, isActive, onClick
}: {
  webtoon: BannerWebtoon;
  isVisible: boolean;
  isFirstVisible: boolean;
  isActive: boolean;
  onClick: () => void;
}) {

  const t = useTranslations("homeMain");
  const ageRestrictionT = useTranslations("ageRestriction");
  const time = convertTimeLeft(webtoon.hoursLeft);

  return (
    <Col
      className={clsx(
        "rounded-[8px] overflow-hidden h-full relative transition-all duration-150 ease-linear", {
          "flex-1": isActive,
          "w-[6.6%] cursor-pointer": !isActive && isVisible,
          "ml-7": !isFirstVisible && isVisible,
        }
      )}
      onClick={onClick}
    >
      <Image
        src={webtoon.thumbnail} alt="Item thumbnail" draggable={false}
        loading="eager"
        fill={true}
        className="object-cover object-center"
      />
      {isVisible && <div className="w-full h-full z-15">
        <div style={{
          position: "absolute",
          height: "50%",
          width: "100%",
          bottom: 0,
          background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, ${webtoon.bgColor} 100%)`
        }}></div>
        {isActive && <div style={{
          position: "absolute",
          height: "100%",
          width: "25%",
          left: 0,
          background: `linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, ${webtoon.bgColor} 100%)`
        }}></div>}
      </div>}
      {isActive && <div className="z-20 text-white">
        <div className="flex px-3 py-2 bg-white w-fit rounded-full font-bold text-black text-xs left-8 top-8 absolute">
          <div className="flex items-center">
            <Image src={ClockIcon} alt="clock" className="mr-2"/>
            <span>
              {t.rich("timeLeft", {
                days: time.days,
                hours: time.hours,
                minutes: time.minutes,
                hl: (chunks) => <HighlightedText>{chunks}</HighlightedText>
              })}
            </span>
          </div>
          <div className="flex items-center mx-2">
            <Image src={BarIcon} alt="bar"/>
          </div>
          <div className="flex items-center">
            <Image src={OffersIcon} alt="offers" className="mr-2"/>
            <span>
              {t.rich("numberOfOffers", {
                count: webtoon.offers,
                hl: (chunks) => <HighlightedText>{chunks}</HighlightedText>
              })}
            </span>
          </div>
        </div>
        <div className="left-8 bottom-8 absolute flex flex-col gap-1">
          <div className="flex gap-1">
            <Badge>연재중</Badge>
            <Badge>{ageRestrictionT(webtoon.ageLimit)}</Badge>
          </div>
          <div className="text-3xl font-bold">{webtoon.title}</div>
          <div className="text-base">{webtoon.creatorName}</div>
        </div>
      </div>}
    </Col>
  );
}

function HighlightedText({ children, className }: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={clsx("text-red", className)}>{children}</span>;
}

function Badge({ children, className }: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("rounded-full border border-white w-fit text-xs px-2.5 py-1 inline-flex", className)}>
    {children}
  </div>;
}

const convertTimeLeft = (totalHours: number) => {
  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);
  const minutes = Math.floor((totalHours % 1) * 60);

  return { days, hours, minutes };
};