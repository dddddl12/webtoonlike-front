export type AdminFormT = {
    userId: number | null;
    isSuper?: (boolean | null) | undefined;
}

type _AdminT = {
    id: number;
    createdAt: Date;
    updatedAt?: Date | undefined;
    userId: number | null;
    isSuper?: (boolean | null) | undefined;
}

export type GetAdminOptionT = {
    meId?: (number | undefined) | undefined;
    $user?: boolean | undefined;
}

export type ListAdminOptionT = {
    meId?: ((number | undefined) | undefined) | undefined;
    $user?: (boolean | undefined) | undefined;
}


// @type-gen remain
import type { UserT } from "./User";

export interface AdminT extends _AdminT {
  user: UserT
}