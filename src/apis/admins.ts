import { server } from "@/system/axios";
import type * as R from "@backend/types/Admin.api";

const root = "/admins";

// *SYSTEM (POST) /
export async function create(rqs: R.CreateRqs): Promise<R.CreateRsp> {
  const rsp = await server.post(`${root}`, rqs);
  return rsp.data;
}

// *ADMIN (POST) /by-email
export async function createByEmail(rqs: R.CreateByEmailRqs): Promise<R.CreateByEmailRsp> {
  const rsp = await server.post(`${root}/by-email`, rqs);
  return rsp.data;
}

// (GET) /
export async function list(rqs: R.ListRqs): Promise<R.ListRsp> {
  const rsp = await server.get(`${root}`, { params: rqs });
  return rsp.data;
}

// *ADMIN (DELETE) /:id
export async function remove(id: number): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

// (GET) /me
export async function getMe(): Promise<R.GetMeRsp> {
  const rsp = await server.get(`${root}/me`);
  return rsp.data;
}

// (GET) /load-media
export async function loadMedia(rqs: R.LoadMediaRqs): Promise<R.LoadMediaRsp> {
  const rsp = await server.get(`${root}/load-media`, { params: rqs });
  return rsp.data;
}