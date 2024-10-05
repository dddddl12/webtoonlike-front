import type { AdminT, AdminFormT, ListAdminOptionT } from "./Admin";

// root = /users

// *SYSTEM (POST) /
export type CreateRqs = {form: AdminFormT}
export type CreateRsp = AdminT

// *ADMIN (POST) /by-email
export type CreateByEmailRqs = {email: string}
export type CreateByEmailRsp = AdminT

// (GET) /
export type ListRqs = ListAdminOptionT
export type ListRsp = ListData<AdminT>

// *ADMIN (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = AdminT

// (GET) /me
export type GetMeRqs = null
export type GetMeRsp = GetData<AdminT|null>

// (GET) /load-media
export type LoadMediaRqs = {key: string}
export type LoadMediaRsp = {data: string|undefined}