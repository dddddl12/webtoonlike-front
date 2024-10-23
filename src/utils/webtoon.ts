import { WebtoonT } from "@/resources/webtoons/webtoon.types";

export function extractAuthorName(webtoon: WebtoonT): string | null | undefined {
  return webtoon.creator?.name;
}

export function extractAuthorNameEn(webtoon: WebtoonT): string|null|undefined {
  return webtoon.creator?.name_en ?? webtoon.creator?.name;
}