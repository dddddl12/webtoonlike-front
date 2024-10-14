export type GenreFormT = {
    label: string;
    label_en?: (string | null) | undefined;
    rank?: (number | null) | undefined;
}

export type GenreT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    label: string;
    label_en?: (string | null) | undefined;
    rank?: (number | null) | undefined;
}

export type GetGenreOptionT = {
    meId?: number | undefined;
}
