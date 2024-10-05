import type {
  WebtoonEpisodeFormT, WebtoonEpisodeT,
  GetWebtoonEpisodeOptionT, ListWebtoonEpisodeOptionT
} from "./WebtoonEpisode";
import { WebtoonEpisodeImageFormT } from "./WebtoonEpisodeImage";

// root = /webtoon-eppisodes

// (POST) /
export type CreateRqs = {
  form: WebtoonEpisodeFormT
  relations?: {
    images?: WebtoonEpisodeImageFormT[]
  }
}
export type CreateRsp = WebtoonEpisodeT


// *ADMIN|*AUTHOR (PATCH) /:id
export type UpdateRqs = {
  form: Partial<WebtoonEpisodeFormT>,
  relations?: {
    images?: WebtoonEpisodeImageFormT[]
  }
}
export type UpdateRsp = WebtoonEpisodeT

// (GET) /
export type ListRqs = ListWebtoonEpisodeOptionT
export type ListRsp = ListData<WebtoonEpisodeT>


// (GET) /:id
export type GetRqs = GetWebtoonEpisodeOptionT
export type GetRsp = GetData<WebtoonEpisodeT>

// (POST) /thumbnail/presigned-url
export type ThumbnailPresignedUrlRqs = {mimeType: string}
export type ThumbnailPresignedUrlRsp = {putUrl: string, key: string}