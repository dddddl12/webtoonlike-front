import type { XWebtoonGenreT, XWebtoonGenreFormT } from "./XWebtoonGenre";

// (POST) /
export type CreateRqs = {form: XWebtoonGenreFormT}
export type CreateRsp = XWebtoonGenreT

// (DELETE) /
export type DeleteRqs = {webtoonId: idT, genreId: idT}
export type DeleteRsp = XWebtoonGenreT


// (POST /reset-by-webtoon
export type ResetByWebtoonRqs = {webtoonId: idT}
export type ResetByWebtoonRsp = boolean