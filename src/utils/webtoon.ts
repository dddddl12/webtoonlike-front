import type { WebtoonT } from "@/types";

export function extractAuthorName(webtoon: WebtoonT): string | null | undefined {
  return webtoon.authorDetail ?? webtoon.creator?.name;
}

export function extractAuthorNameEn(webtoon: WebtoonT): string|null|undefined {
  return webtoon.authorDetail_en ?? webtoon.creator?.name_en ?? webtoon.authorDetail ?? webtoon.creator?.name;
}