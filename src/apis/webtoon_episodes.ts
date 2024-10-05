import { server } from "@/system/axios";
import type * as R from "@/types/WebtoonEpisode.api";
import type {
  WebtoonEpisodeT, WebtoonEpisodeFormT,
  GetWebtoonEpisodeOptionT, ListWebtoonEpisodeOptionT
} from "@/types/WebtoonEpisode";
import type { WebtoonEpisodeImageFormT } from "@/types/WebtoonEpisodeImage";

const root = "/webtoon-episodes";


export async function create(
  form: WebtoonEpisodeFormT,
  relations?: {images?: WebtoonEpisodeImageFormT[]},
): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form, relations };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(
  id: idT,
  form: Partial<WebtoonEpisodeFormT>,
  relations?: {images?: WebtoonEpisodeImageFormT[]},
): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form, relations };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function list(listOpt: ListWebtoonEpisodeOptionT = {}): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


export async function get(id: idT, getOpt: GetWebtoonEpisodeOptionT = {}): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function getThumbnailPresignedUrl(mimeType: string): Promise<R.ThumbnailPresignedUrlRsp> {
  const body: R.ThumbnailPresignedUrlRqs = { mimeType };
  const rsp = await server.post(`${root}/thumbnail/presigned-url`, body);
  return rsp.data;
}