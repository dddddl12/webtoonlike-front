import { server } from "@/system/axios";
import type * as R from "@/types/WebtoonEpisodeImage.api";
import type {
  WebtoonEpisodeImageT, WebtoonEpisodeImageFormT,
  GetWebtoonEpisodeImageOptionT, ListWebtoonEpisodeImageOptionT,
} from "@/types/WebtoonEpisodeImage";

const root = "/webtoon-episode-images";


export async function create(form: WebtoonEpisodeImageFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function list(listOpt: ListWebtoonEpisodeImageOptionT = {}): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function remove(id: idT): Promise<R.RemoveRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function getPresignedUrl(mimeType: string): Promise<R.GetPresignedUrlRsp> {
  const body: R.GetPresignedUrlRqs = { mimeType };
  const rsp = await server.post(`${root}/presigned-url`, body);
  return rsp.data;
}