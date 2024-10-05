import { atom, useRecoilValue } from "recoil";
import { BaseStateT, useBaseActions } from "./molds/base";
import type { UserT, AdminT } from "@/types";


interface UserStateT extends BaseStateT<{
  me: UserT|null
  admin: AdminT|null
}> {}


const userState = atom<UserStateT>({
  key: "userState",
  default: {
    status: "idle",
    data: undefined,
    lastUpdated: undefined,
    lastKey: undefined,
  },
});


export function useUser$(): UserStateT {
  return useRecoilValue(userState);
}

export function useMe(): UserT|null {
  const { data } = useUser$();
  return data?.me ?? null;
}

export function useAdmin(): AdminT|null {
  const { data } = useUser$();
  return data?.admin ?? null;
}

export function useUserActions() {
  const {
    set,
    patch,
    patchData,
    reset,
  } = useBaseActions({
    state: userState,
  });

  return {
    set,
    patch,
    patchData,
    reset,
  };
}

