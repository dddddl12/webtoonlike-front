export type WebtoonEpisodeFormT = {
    authorId: number | null;
    webtoonId: number;
    episodeNo: number;
    title?: (string | null) | undefined;
    title_en?: (string | null) | undefined;
    description?: (string | null) | undefined;
    thumbPath?: (string | null) | undefined;
    englishUrl?: (string | null) | undefined;
    modifiedAt?: (Date | null) | undefined;
    publishedAt?: (Date | null) | undefined;
}

type _WebtoonEpisodeT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    authorId: number | null;
    webtoonId: number;
    episodeNo: number;
    title?: (string | null) | undefined;
    title_en?: (string | null) | undefined;
    description?: (string | null) | undefined;
    thumbPath?: (string | null) | undefined;
    englishUrl?: (string | null) | undefined;
    modifiedAt?: (Date | null) | undefined;
    publishedAt?: (Date | null) | undefined;
}

export type GetWebtoonEpisodeOptionT = {
    meId?: (number | undefined) | undefined;
    $images?: boolean | undefined;
}

export type ListWebtoonEpisodeOptionT = {
    meId?: ((number | undefined) | undefined) | undefined;
    $images?: (boolean | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    webtoonId?: number | undefined;
}


// @type-gen remain
import type { WebtoonEpisodeImageT } from "./WebtoonEpisodeImage";

export interface WebtoonEpisodeT extends _WebtoonEpisodeT {
  images?: WebtoonEpisodeImageT[]
}