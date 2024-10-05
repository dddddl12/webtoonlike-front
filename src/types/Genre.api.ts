import type {
  GenreFormT, GenreT, GetGenreOptionT, ListGenreOptionT,
} from "./Genre";

// *ADMIN (POST) /
export type CreateRqs = {form: GenreFormT}
export type CreateRsp = GenreT

// (GET) /
export type ListRqs = ListGenreOptionT
export type ListRsp = ListData<GenreT>

// (GET) /:id
export type GetRqs = GetGenreOptionT
export type GetRsp = GetData<GenreT>

// *ADMIN (PATCH) /:id
export type UpdateRqs = {form: Partial<GenreFormT>}
export type UpdateRsp = GenreT

// *ADMIN (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = GenreT
