import { server } from "@/system/axios";
import type * as R from "@/types/User.api";
import type { UserT, UserFormT, GetUserOptionT, ListUserOptionT } from "@/types";

const root = "/users";

export async function getMe(getOpt: GetUserOptionT ): Promise<R.GetMeRsp> {
  const params: R.GetMeRqs = getOpt;
  const rsp = await server.get(`${root}/me`, { params });
  return rsp.data;
}

export async function createMe(form: UserFormT): Promise<R.CreateMeRsp> {
  const body: R.CreateMeRqs = { form };
  const rsp = await server.post(`${root}/me`, body);
  return rsp.data;
}

export async function deleteMe(): Promise<R.DeleteMeRsp> {
  const rsp = await server.delete(`${root}/me`);
  return rsp.data;
}

export async function list(getOpt: ListUserOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = getOpt;
  const rsp = await server.get(`${root}/`, { params });
  return rsp.data;
}

export async function getUsersStats() {
  const rsp = await server.get(`${root}/stats`);
  return rsp.data;
}