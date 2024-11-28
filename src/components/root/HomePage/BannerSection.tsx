"use client";

import { Col, Row } from "@/components/ui/common";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { clsx } from "clsx";
import OffersIcon from "./icons/offers.svg";
import LinkWithAccessCheck from "@/components/root/HomePage/ui/LinkWithAccessCheck";
import { HomeItemsT } from "@/resources/home/home.dto";

export default function BannerSection({ banners }: {
  banners: HomeItemsT["banners"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = banners.length - 1;
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);

  useEffect(() => {
    const firstVisibleIndex = Math.max(activeIndex - 1, 0);
    const lastVisibleIndex = Math.min(activeIndex + 2, lastIndex);
    const indices: number[] = [];
    for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
      indices.push(i);
    }
    setVisibleIndices(indices);
  }, [activeIndex, lastIndex]);

  if (banners.length === 0) {
    return <Row>
      <p className="text-gray-shade mx-auto">등록된 웹툰이 없습니다.</p>
    </Row>;
  }

  return (
    <Row>
      {banners.map((webtoon, index) => {
        return (
          <Slide
            key={webtoon.id}
            webtoon={webtoon}
            isVisible={visibleIndices.includes(index)}
            isFirstVisible={visibleIndices[0] === index}
            isActive={activeIndex === index}
            setAsActive={() => setActiveIndex(index)}
          />
        );
      })}
    </Row>
  );
}

function Slide({
  webtoon, isVisible, isFirstVisible, isActive, setAsActive
}: {
  webtoon: HomeItemsT["banners"][number];
  isVisible: boolean;
  isFirstVisible: boolean;
  isActive: boolean;
  setAsActive: () => void;
}) {

  const t = useTranslations("homeMain");
  const ageRestrictionT = useTranslations("ageRestriction");

  return (
    <Col
      className={clsx(
        "rounded-[8px] overflow-hidden h-[400px] relative transition-all duration-150 ease-linear cursor-pointer ", {
          "flex-1": isActive,
          "w-[6.6%]": !isActive && isVisible,
          "ml-7": !isFirstVisible && isVisible,
        }
      )}
      onClick={setAsActive}
    >
      <LinkWithAccessCheck
        href={`/webtoons/${webtoon.id}`}
        disabled={!isActive}
      >
        <Image
          src={webtoon.thumbPath}
          alt="Item thumbnail"
          draggable={false}
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
          }}></div>
          {isActive && <div style={{
            position: "absolute",
            height: "100%",
            width: "25%",
            left: 0,
          }}></div>}
        </div>}
        {isActive && <div className="z-20 text-white">
          <div className="flex px-3 py-2 bg-white w-fit rounded-full font-bold text-black text-xs left-8 top-8 absolute">
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
              <Badge>{webtoon.isNew ? "연재중" : "완결"}</Badge>
              <Badge>{ageRestrictionT(webtoon.ageLimit)}</Badge>
            </div>
            <div className="text-3xl font-bold">{webtoon.localized.title}</div>
            <div className="text-base">
              {webtoon.localized.authorOrCreatorName}
            </div>
          </div>
        </div>}
      </LinkWithAccessCheck>
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
