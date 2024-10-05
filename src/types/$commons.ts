export type InsertFormT = {}

export type BaseModelT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
}

export type GetOptionT = {
    meId?: number | undefined;
}
