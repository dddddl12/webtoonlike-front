export type WebtoonEpisodeImageFormT = {
    episodeId: number;
    host?: (string | null) | undefined;
    path: string;
    mimeType: string;
    width?: (number | null) | undefined;
    height?: (number | null) | undefined;
    rank?: (number | null) | undefined;
}

type _WebtoonEpisodeImageT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    episodeId: number;
    host?: (string | null) | undefined;
    path: string;
    mimeType: string;
    width?: (number | null) | undefined;
    height?: (number | null) | undefined;
    rank?: (number | null) | undefined;
}

export type GetWebtoonEpisodeImageOptionT = {
    meId?: number | undefined;
}

export type ListWebtoonEpisodeImageOptionT = {
    meId?: (number | undefined) | undefined;
    episodeId?: number | undefined;
}


// @type-gen remain
export interface WebtoonEpisodeImageT extends _WebtoonEpisodeImageT { }