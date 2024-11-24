"use server";

// import { Injectable } from "@nestjs/common";
// import { notificationM } from "@/models/notifications";
// import * as err from "@/errors";
// import { listNotification } from "./fncs/list_notifications";
// import type { NotificationFormT, NotificationT, ListNotificationOptionT } from "@/types";
//
// @Injectable()
// class NotificationService {
//   constructor() {}
//
//   async create(form: NotificationFormT): Promise<NotificationT> {
//     const created = await notificationM.create(form);
//     if (!created) {
//       throw new err.NotAppliedE();
//     }
//     return created;
//   }
//
//   async list(listOpt: ListNotificationOptionT): Promise<ListData<NotificationT>> {
//     return listNotification(listOpt);
//   }
//
//   async checkAll(userId: idT): Promise<void> {
//     await notificationM.updateMany({ userId: userId }, { isRead: true });
//   }
// }