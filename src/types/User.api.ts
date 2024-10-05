import type { UserFormT, UserT, GetUserOptionT, ListUserOptionT } from "./User";

// root = /users

// (POST) /me
export type CreateMeRqs = {form: UserFormT}
export type CreateMeRsp = UserT

// (GET) /me
export type GetMeRqs = GetUserOptionT
export type GetMeRsp = GetData<UserT|null>

// (DELETE) /me
export type DeleteMeRqs = null
export type DeleteMeRsp = boolean


// *ADMIN (GET) /
export type ListRqs = ListUserOptionT
export type ListRsp = ListData<UserT>