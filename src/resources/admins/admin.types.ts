import { UserT } from "@/resources/users/user.types";

export type AdminFormT = {
    userId: number | null;
    isSuper?: (boolean | null) | undefined;
}

type _AdminT = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
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


export interface AdminT extends _AdminT {
  user: UserT
}