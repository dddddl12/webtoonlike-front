import { useSetRecoilState, useRecoilCallback, type RecoilState } from "recoil";

export interface BaseStateT<DataT> {
  status: ProcessStatusT
  data?: DataT
  lastUpdated?: Date|null
  lastKey?: string
}

export interface BaseActionsOptionT<DataT > {
  state: RecoilState<BaseStateT<DataT>>,
}


export function useBaseActions<DataT>({
  state,
}: BaseActionsOptionT<DataT>) {
  const set = useSetRecoilState(state);


  function patch(state: Partial<BaseStateT<DataT>>) {
    set((prev) => ({ ...prev, ...state }));
  }

  function patchData(data: Partial<DataT>) {
    set((prev) => {
      if (prev.data === undefined) {
        return prev;
      }
      return { ...prev, data: { ...prev.data, ...data } };
    });
  }

  function reset() {
    set({ status: "idle", data: undefined });
  }

  return {
    set,
    patch,
    patchData,
    reset,
  };
}