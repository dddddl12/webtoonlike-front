import type { CreatorFormT, CreatorT, ListCreatorOptionT, GetCreatorOptionT } from "./Creator";

// (POST) /
export type CreateRqs = {
  form: CreatorFormT
}
export type CreateRsp = CreatorT

// (GET) /
export type ListRqs = ListCreatorOptionT
export type ListRsp = ListData<CreatorT>

// (POST) /thumbnail/presigned-url
export type ThumbnailPresignedUrlRqs = { mimeType: string }
export type ThumbnailPresignedUrlRsp = { putUrl: string, key: string }

// (GET) /:id
export type GetRqs = GetCreatorOptionT
export type GetRsp = { data: CreatorT }

// (PATCH) /:id
export type UpdateRqs = { form: Partial<CreatorFormT> }
export type UpdateRsp = CreatorT