import type {
  WebtoonEpisodeImageFormT,
  WebtoonEpisodeImageT,
  // GetWebtoonEpisodeImageOptionT,
  ListWebtoonEpisodeImageOptionT,
} from "./WebtoonEpisodeImage";

// root = /webtoon-eppisode-images

// (POST) /
export type CreateRqs = {form: WebtoonEpisodeImageFormT}
export type CreateRsp = WebtoonEpisodeImageT


// (GET) /
export type ListRqs = ListWebtoonEpisodeImageOptionT
export type ListRsp = ListData<WebtoonEpisodeImageT>

// (DELETE) /:id
export type RemoveRqs = null
export type RemoveRsp = WebtoonEpisodeImageT

// (POST) /presigned-url
export type GetPresignedUrlRqs = {mimeType: string}
export type GetPresignedUrlRsp = {putUrl: string, key: string}