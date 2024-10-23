export type GenreFormT = {
    label: string;
    label_en?: (string | null) | undefined;
    rank?: (number | null) | undefined;
}

export type GenreT = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    label: string;
    label_en: string | null;
    rank: number | null;
}

export type GetGenreOptionT = {
    meId?: number | undefined;
}

export type ListGenreOptionT = {
    meId?: number | undefined;
}
