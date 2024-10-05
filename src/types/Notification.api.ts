import type { NotificationT, ListNotificationOptionT } from "./Notification";

// (GET) /
export type ListRqs = ListNotificationOptionT
export type ListRsp = ListData<NotificationT>

// (PUT) /check-all
export type CheckAllRqs = null
export type CheckAllRsp = boolean