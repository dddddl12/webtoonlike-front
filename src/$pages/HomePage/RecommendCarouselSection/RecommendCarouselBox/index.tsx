"use client";

import { useEffect, useState } from "react";
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
import { RecommendCarouselItem } from "./RecommendCarouselItem";
import { Text } from "@/ui/texts";
import * as WebtoonApi from "@/apis/webtoons";
import { ListWebtoonOptionT } from "@/types";

export function RecommendCarouselBox() {
  const { data: Webtoons$, actions: webtoonsAct } = useListData({
    listFn: WebtoonApi.list,
  });

  const listOpt: ListWebtoonOptionT = {
    $creator: true,
    bidStatus: "bidding, negotitating",
    // bidStatus: "waiting, bidding",
    sort: "popular",
  };

  useEffect(() => {
    webtoonsAct.load(listOpt);
  }, []);

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
        spaceBetween={28}
        centeredSlides={true}
        // autoplay={{
        //   delay: -10,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        // }}
        speed={5000}
        loop={true}
        grabCursor={true}
        modules={[Autoplay]}
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
            slidesPerView: 5,
          },
        }}
        className="mySwiper-recommend w-full max-w-[1200px]"
      >
        {Webtoons$.data.length > 0
          ? Webtoons$.data.map((webtoon) =>
            <SwiperSlide key={webtoon.id}>
              <RecommendCarouselItem webtoon={webtoon} />
            </SwiperSlide>)
          : <Row className="justify-center items-center">
            <Text className="text-gray-shade">등록된 웹툰이 없습니다.</Text>
          </Row>}
      </Swiper>
    </Col>
  );
}
