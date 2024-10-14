import { server } from "@/system/axios";
import type * as R from "@/types/User.api";
import { UserT, UserFormT, ListUserOptionT, UserWithBuyerT, UserWithCreatorT } from "@/types";

const root = "/users";

// (GET) /me
export async function getMe(getOpt: { $buyer: true, $creator?: never }): Promise<UserWithBuyerT>;
export async function getMe(getOpt: { $creator: true, $buyer?: never }): Promise<UserWithCreatorT>;
export async function getMe(getOpt: { $buyer: never, $creator?: never }): Promise<UserT>;

export async function getMe(getOpt: {
    $buyer?: boolean;
    $creator?: boolean;
}): Promise<UserT> {
  const params: R.GetMeRqs = getOpt;
  const rsp = await server.get(`${root}/me`, { params });
  if (getOpt.$buyer) {
    return rsp.data as UserWithBuyerT;
  } else if (getOpt.$creator) {
    return rsp.data as UserWithCreatorT;
  } else {
    return rsp.data as UserT;
  }
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