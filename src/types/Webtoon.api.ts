import type { WebtoonFormT, WebtoonT, GetWebtoonOptionT, ListWebtoonOptionT } from "./Webtoon";

// root = /webtoons

// (POST) /
export type CreateRqs = {form: WebtoonFormT}
export type CreateRsp = WebtoonT

// (GET) /
export type ListRqs = ListWebtoonOptionT
export type ListRsp = ListData<WebtoonT>

// (GET) /:id
export type GetRqs = GetWebtoonOptionT
export type GetRsp = GetData<WebtoonT>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<WebtoonFormT>}
export type UpdateRsp = WebtoonT

// (POST) /thumbanil/presigned-url
export type ThumbnailPresignedUrlRqs = { mimeType: string}
export type ThumbnailPresignedUrlRsp = {putUrl: string, key: string}

// (GET) /homeItems
export type HomeItems = {
  popular: WebtoonT[];
  recommendations: WebtoonT[];
  brandNew: WebtoonT[];
  perGenre: WebtoonT[];
}
