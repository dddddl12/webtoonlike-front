export type WebtoonLikeFormT = {
    webtoonId: number;
}

export type WebtoonLikeT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    webtoonId: number;
}
