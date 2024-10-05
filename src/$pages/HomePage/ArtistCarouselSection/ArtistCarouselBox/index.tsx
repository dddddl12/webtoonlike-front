"use client";

import { Row } from "@/ui/layouts";
import { ArtistCarouselItem } from "./ArtistCarouselItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./Carousel.css";
import * as CreatorApi from "@/apis/creators";
import { useListData } from "@/hooks/ListData";
import { useEffect } from "react";
import { ListCreatorOptionT } from "@/types";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { Text } from "@/ui/texts";

export function ArtistCarouselBox() {
  const { data: Artists$, actions: artistsAct } = useListData({
    listFn: CreatorApi.list,
  });

  const listOpt: ListCreatorOptionT = {
    $numWebtoon: true,
    $numWebtoonLike: true,
    exposed: "only",
  };

  useEffect(() => {
    artistsAct.load(listOpt);
  }, []);

  const { status, data: artists } = Artists$;

  if (status == "idle" || status == "loading") {
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
      <Swiper
        slidesPerView={5}
        spaceBetween={28}
        centeredSlides={true}
        autoplay={{
          delay: -10,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
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
            slidesPerView: 7,
          },
        }}
        className="mySwiper-artist w-full"
      >
        {artists && artists.length > 0 ?
          artists.map((artist, i) =>
            <SwiperSlide key={i}>
              <ArtistCarouselItem artist={artist} />
            </SwiperSlide>) :
          <Row className="justify-center items-center">
            <Text className="text-gray-shade">등록된 작가가 없습니다.</Text>
          </Row>}
      </Swiper>
    </Row>
  );
}
