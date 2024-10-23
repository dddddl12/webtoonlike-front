// import { Injectable } from "@nestjs/common";
// import * as err from "@/errors";
// import { userM } from "@/models/users";
// import { adminM } from "@/models/admins";
// import { lookupBuilder } from "./fncs/lookup_builder";
// import { getObject } from "@/utils/s3";
// import type { AdminT, AdminFormT, ListAdminOptionT } from "@/types";
//
// @Injectable()
// export class AdminService {
//   constructor() {}
//
//
//   async get(id: idT): Promise<AdminT> {
//     const fetched = await adminM.findOne({ id });
//     if (!fetched) {
//       throw new err.NotExistE(`admin with id ${id} not found`);
//     }
//     return fetched;
//   }
//
//   async create(form: AdminFormT): Promise<AdminT> {
//     const created = await adminM.create(form);
//     if (!created) {
//       throw new err.NotAppliedE();
//     }
//     return created;
//   }
//
//   async createByEmail(email: string): Promise<AdminT> {
//     const user = await userM.findOne({ email });
//     if (!user) {
//       throw new err.NotExistE(`user with email ${email} not found`);
//     }
//     const created = await adminM.create({
//       userId: user.id,
//       isSuper: false,
//     });
//     if (!created) {
//       throw new err.NotAppliedE();
//     }
//     return created;
//   }
//
//   async list(listOpt: ListAdminOptionT): Promise<ListData<AdminT>> {
//     const fetched = await adminM.find({
//       builder: (qb, select) => {
//         lookupBuilder(select, listOpt);
//       }
//     });
//     return { data: fetched, nextCursor: null };
//   }
//
//
//   async getMe(userId: idT): Promise<AdminT|null> {
//     const fetched = await adminM.findOne({ userId });
//     return fetched;
//   }
//
//   async remove(id: idT): Promise<AdminT> {
//     const removed = await adminM.deleteOne({ id });
//     if (!removed) {
//       throw new err.NotAppliedE();
//     }
//     return removed;
//   }
//
//   async loadMedia(key: string): Promise<string|undefined> {
//     try {
//       const media = await getObject(key);
//       return media;
//     } catch (e) {
//       throw new err.NotExistE(`media with key ${key} not found`);
//     }
//   }
// }