"use server";
import { server } from "@/system/axios";
import type * as R from "@backend/types/Creator.api";
import type { CreatorFormT, GetCreatorOptionT } from "@backend/types/Creator";

const root = "/creators";


export async function create(form: CreatorFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function getThumbnailPresignedUrl(mimeType: string): Promise<R.ThumbnailPresignedUrlRsp> {
  const body: R.ThumbnailPresignedUrlRqs = { mimeType };
  const rsp = await server.post(`${root}/thumbnail/presigned-url`, body);
  return rsp.data;
}

export async function list(params: R.ListRqs): Promise<R.ListRsp> {
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function get(id: idT, getOpt: GetCreatorOptionT ): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

// (PATCH) /:id
export async function update(id: number, form: Partial<CreatorFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}