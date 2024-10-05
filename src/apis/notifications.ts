import { server } from "@/system/axios";
import type * as R from "@/types/Notification.api";
import type { NotificationFormT, NotificationT, ListNotificationOptionT } from "@/types/Notification";

const root = "/notifications";

export async function list(listOpt: ListNotificationOptionT): Promise<R.ListRsp> {
  const params : R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function checkAll(): Promise<R.CheckAllRsp> {
  const rsp = await server.put(`${root}/check-all`);
  return rsp.data;
}

