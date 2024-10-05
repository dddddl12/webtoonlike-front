import { server } from "@/system/axios";
import type * as R from "@/types/Genre.api";
import { GenreFormT, GetGenreOptionT, ListGenreOptionT } from "@/types";

const root = "/genres";

// *ADMIN (POST) /
export async function create(form: GenreFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}/`, body);
  return rsp.data;
}

// (GET) /
export async function list(listOpt: ListGenreOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}/`, { params });
  return rsp.data;
}

// (GET) /:id
export async function get(id: idT, getOpt: GetGenreOptionT = {}): Promise<R.GetRsp> {
  const params: GetGenreOptionT = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

// *ADMIN (PATCH) /:id
export async function update(id: number, form: Partial<GenreFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

// *ADMIN (DELETE) /:id
export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}