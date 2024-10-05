export type XWebtoonGenreFormT = {
    webtoonId: number;
    genreId: number;
}

export type XWebtoonGenreT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    webtoonId: number;
    genreId: number;
}
