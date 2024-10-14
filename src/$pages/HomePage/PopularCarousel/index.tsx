"use client";

import { Row } from "@/ui/layouts";
import { PopularCarouselItem } from "./PopularCarouselItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import type { WebtoonT } from "@backend/types/Webtoon";

export function PopularCarousel({ webtoons }: {
    webtoons: WebtoonT[]
}) {
  return <Row>
    {webtoons.length === 1 ? (
      <Row className="w-[800px] justify-center m-auto">
        <PopularCarouselItem webtoon={webtoons[0]} />
      </Row>
    ) : (
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        // TODO slidesPerView={viewportWidth > 768 ? 2 : 1}
        slidesPerView={2}
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
          <SwiperSlide key={webtoon.id}>
            <PopularCarouselItem webtoon={webtoon} />
          </SwiperSlide>
        )}
      </Swiper>
    )}
  </Row>;
}
