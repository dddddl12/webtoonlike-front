export type WebtoonLikeFormT = {
    userId: number | null;
    webtoonId: number;
}

export type WebtoonLikeT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    userId: number | null;
    webtoonId: number;
}
