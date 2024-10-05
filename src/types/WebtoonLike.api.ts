import type { WebtoonLikeT, WebtoonLikeFormT } from "./WebtoonLike";

// root = /webtoon-likes

// (POST) /
export type CreateRqs = {form: WebtoonLikeFormT }
export type CreateRsp = WebtoonLikeT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = WebtoonLikeT