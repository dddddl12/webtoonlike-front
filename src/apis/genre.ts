import { server } from "@/system/axios";
import type * as R from "@backend/types/Genre.api";
import type { GenreFormT, GetGenreOptionT } from "@backend/types/Genre";

const root = "/genres";

// *ADMIN (POST) /
export async function create(form: GenreFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}/`, body);
  return rsp.data;
}

// (GET) /
export async function list(): Promise<R.ListRsp> {
  const rsp = await server.get(`${root}/`);
  return rsp.data;
}

// (GET) /:id
export async function get(id: number, getOpt: GetGenreOptionT = {}): Promise<R.GetRsp> {
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
export async function remove(id: number): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}