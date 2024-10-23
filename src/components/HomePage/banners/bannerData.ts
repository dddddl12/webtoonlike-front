import BANNER0 from "@/components/HomePage/banners/images/banner_image0.jpeg";
import BANNER1 from "@/components/HomePage/banners/images/banner_image1.jpeg";
import BANNER2 from "@/components/HomePage/banners/images/banner_image2.jpeg";
import BANNER3 from "@/components/HomePage/banners/images/banner_image3.jpeg";
import BANNER4 from "@/components/HomePage/banners/images/banner_image4.jpeg";
import BANNER5 from "@/components/HomePage/banners/images/banner_image5.jpeg";
import BANNER6 from "@/components/HomePage/banners/images/banner_image6.jpeg";
import { StaticImageData } from "next/image";
import { AgeLimit } from "@/resources/webtoons/webtoon.types";

export type BannerWebtoon = {
  id: number;
  offers: number;
  title: string;
  creatorName: string;
  ageLimit: AgeLimit;
  thumbnail: StaticImageData;
  hoursLeft: number;
  bgColor: string;
}
export const bannerWebtoons: BannerWebtoon[] = [
  {
    id: 0,
    offers: 80,
    title: "오! 나의 하녀님",
    creatorName: "봄온다 글, 보리 그림",
    ageLimit: AgeLimit.All,
    thumbnail: BANNER0,
    hoursLeft: 5.5,
    bgColor: "#F1D2B5"
  },
  {
    id: 1,
    offers: 24,
    title: "이애편달",
    creatorName: "글 폳도, 그림 뽀므",
    ageLimit: AgeLimit.All,
    thumbnail: BANNER1,
    hoursLeft: 25,
    bgColor: "#0A0A0A"
  },
  {
    id: 2,
    offers: 45,
    title: "대영반",
    creatorName: "봄온다 글, 보리 그림",
    ageLimit: AgeLimit.All,
    thumbnail: BANNER2,
    hoursLeft: 15.2,
    bgColor: "#000103"
  },
  {
    id: 3,
    offers: 11,
    title: "나의 자리",
    creatorName: "봄온다 글, 보리 그림",
    ageLimit: AgeLimit.All,
    thumbnail: BANNER3,
    hoursLeft: 8.1,
    bgColor: "#1A1F3E"
  },
  {
    id: 4,
    offers: 111,
    title: "우주 최강의 첫사랑",
    creatorName: "산보 글, 인용 그림",
    ageLimit: AgeLimit.All,
    thumbnail: BANNER4,
    hoursLeft: 13.5,
    bgColor: "#C19BDB"
  },
  {
    id: 5,
    offers: 13,
    title: "주상복합 퇴마사",
    creatorName: "글 바스타즈, 그림 아콘 너트",
    ageLimit: AgeLimit.All,
    thumbnail: BANNER5,
    hoursLeft: 18.41,
    bgColor: "#862334"
  },
  {
    id: 6,
    offers: 21,
    title: "2회차는 레드카펫으로",
    creatorName: "글 폳도, 그림 뽀므",
    ageLimit: AgeLimit.All,
    thumbnail: BANNER6,
    hoursLeft: 8.4,
    bgColor: "#C1AB96"
  }
];