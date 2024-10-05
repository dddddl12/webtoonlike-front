"use client";

import { useEffect, useState } from "react";
import { Row } from "@/ui/layouts";
import { PopularCarouselItem } from "./PopularCarouselItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { useListData } from "@/hooks/ListData";
import * as WebtoonApi from "@/apis/webtoons";
import type { ListWebtoonOptionT, WebtoonT } from "@/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./Carousel.css";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";

export function PopularCarouselBox() {
  const [viewportWidth, setViewportWidth] = useState(0);
  const listOpt: ListWebtoonOptionT = {
    $episodes: true,
    $myLike: true,
    $creator: true,
    $bidRounds: true,
    bidStatus: "bidding, negotiating",
    $numRequest: true,
    $genres: true,
  };

  const { data: webtoons$, actions: webtoonsAct } = useListData({
    listFn: WebtoonApi.list
  });

  useEffect(() => {
    setViewportWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    webtoonsAct.load(listOpt);
  }, []);

  function handleUpdateSuccessCarouselItem(newWebtoon: WebtoonT) {
    webtoonsAct.replaceItem(newWebtoon);
  }

  const { status, data: webtoons } = webtoons$;

  useEffect(() => {
    const resizeViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", resizeViewportWidth);

    return () => {
      window.removeEventListener("resize", resizeViewportWidth);
    };
  }, []);

  if (status == "idle") {
    return "idle";
  }
  if (status == "loading") {
    return <Spinner />;
  }
  if (status == "error") {
    return <ErrorComponent />;
  }

  return (
    <Row
      // data-aos="fade-up"
      // data-aos-offset="-100"
      // data-aos-delay="0"
      // data-aos-duration="1000"
      // data-aos-easing="ease-in-out"
      // data-aos-once="true"
      // data-aos-anchor-placement="top-center"
    >
      {webtoons.length === 1 ? (
        <Row className="w-[800px] justify-center m-auto">
          <PopularCarouselItem webtoon={webtoons[0]} onUpdateSuccess={handleUpdateSuccessCarouselItem} />
        </Row>
      ) : (
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={viewportWidth > 768 ? 2 : 1}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 300,
            modifier: 1,
            slideShadows: true,
            scale: 0.9
          }}
          speed={1000}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          modules={[Autoplay, EffectCoverflow]}
          className="mySwiper-popular max-w-[2000px]"
        >
          {webtoons.map((webtoon) =>
            <SwiperSlide key={webtoon.id} className="">
              <PopularCarouselItem webtoon={webtoon} onUpdateSuccess={handleUpdateSuccessCarouselItem} />
            </SwiperSlide>
          )}
        </Swiper>
      )}
    </Row>
  );
}
