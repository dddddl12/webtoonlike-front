"use client";

import * as WebtoonApi from "@/apis/webtoons";
import { useListData } from "@/hooks/ListData";
import { Col, Gap, Row } from "@/ui/layouts";

import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Autoplay, Pagination, Navigation } from "swiper/modules";
import { generateRandomString } from "@/utils/randomString";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/grid";
import "./Carousel.css";
import { useEffect, useState } from "react";
import { ListWebtoonOptionT } from "@/types";
import { PerGenreCarouselItem } from "./PerGenreCarouselItem";
import { Badge } from "@/ui/shadcn/Badge";
import type { GenreT } from "@/types";
import { Text } from "@/ui/texts";
import { useLocale } from "next-intl";

type PerGenreCarouselBoxProps = {
  genre: GenreT|null
}

export function PerGenreCarouselBox({ genre }: PerGenreCarouselBoxProps): JSX.Element {
  const locale = useLocale();
  const { data: Webtoons$, actions: webtoonsAct } = useListData({
    listFn: WebtoonApi.list,
  });

  const listOpt: ListWebtoonOptionT = {
    $creator: true,
    genreId: genre?.id,
    // bidStatus: "waiting, bidding, negotiating, done"
    bidStatus: "bidding, negotiating, done"
  };

  useEffect(() => {
    webtoonsAct.load(listOpt);
  }, [JSON.stringify(listOpt)]);

  return (
    <Col
    // data-aos="fade-up"
    // data-aos-offset="-100"
    // data-aos-delay="0"
    // data-aos-duration="1000"
    // data-aos-easing="ease-in-out"
    // data-aos-once="true"
    // data-aos-anchor-placement="top-center"
    >
      <Gap y={10} />
      <Swiper
        slidesPerView={5}
        slidesPerGroup={5}
        spaceBetween={28}
        grid={{
          rows: 2,
          fill: "row",
        }}
        // autoplay={{
        //   delay: -10,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        // }}
        speed={40000}
        pagination={{ clickable: true }}
        loopAddBlankSlides={true}
        grabCursor={true}
        modules={[Grid, Autoplay]}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          976: {
            slidesPerView: 4,
          },
          1110: {
            slidesPerView: 5,
          },
        }}
        className="mySwiper-per-genre w-full max-w-[1200px]"
      >
        {Webtoons$.data.length > 0 ? (
          Webtoons$.data.map((webtoon) => (
            <SwiperSlide key={webtoon.id}>
              <PerGenreCarouselItem webtoon={webtoon} />
            </SwiperSlide>
          ))
        ) : (
          <Row className="justify-center items-center">
            <Text className="text-gray-shade">
              {locale === "en"
                ? "There are no webtoons registered for this genre."
                : "해당하는 장르로 등록된 웹툰이 없습니다."}
            </Text>
          </Row>
        )}
      </Swiper>
    </Col>
  );
}
