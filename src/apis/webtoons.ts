"use server";

import { server } from "@/system/axios";
import type * as R from "@/types/Webtoon.api";
import type { WebtoonFormT, WebtoonT, GetWebtoonOptionT, ListWebtoonOptionT } from "@/types/Webtoon";

const root = "/webtoons";


export async function get(id: idT, getOpt: GetWebtoonOptionT = {}): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function list(listOpt: ListWebtoonOptionT = {}): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function create(form: WebtoonFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<WebtoonFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function getThumbnailPresignedUrl(mimeType: string): Promise<R.ThumbnailPresignedUrlRsp> {
  const body: R.ThumbnailPresignedUrlRqs = { mimeType };
  const rsp = await server.post(`${root}/thumbnail/presigned-url`, body);
  return rsp.data;
}

export async function homeItems(): Promise<R.HomeItems> {
  const rsp = await server.get(`${root}/homeItems`);
  return rsp.data;
}
