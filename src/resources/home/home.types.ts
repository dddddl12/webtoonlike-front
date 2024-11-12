// 홈 화면

import { AgeLimit } from "@/resources/webtoons/webtoon.types";

export type HomeWebtoonItem = {
  id: number;
  thumbPath: string;
  title: string;
  title_en: string;
  authorOrCreatorName: string;
  authorOrCreatorName_en?: string;
};

export type BannerWebtoonItem = HomeWebtoonItem & {
  offers: number;
  ageLimit: AgeLimit;
  isNew: boolean;
};


export type HomeArtistItem = {
  id: number;
  thumbPath?: string;
  name: string;
  name_en?: string;
  numOfWebtoons: number;
};