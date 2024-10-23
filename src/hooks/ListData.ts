"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { replaceItem as replaceItem_ } from "@/utils/misc";

type LoadOptionT = {
  force?: boolean;
  skipLoading?: boolean;
  onSuccess?: () => void;
};

export type ListDataT<ModelT extends BaseModelT, ListDataArgT extends object> = {
  status: ProcessStatusT;
  listArg: ListDataArgT;
  data: ModelT[];
  nextCursor: null | string;
  numData?: number | null;
  appendingStatus: ProcessStatusT;
  lastUpdated: Date|null
  lastKey?: string
};

export interface ListDataConfigT<ModelT extends BaseModelT, ListDataArgT extends object> {
  listFn: (listArg: ListDataArgT) => Promise<ListData<ModelT>>;
  cacheCfg?: {
    genKey: (listArg: ListDataArgT) => string;
    ttl?: number; // in ms
  }
};


export function useListData<ModelT extends BaseModelT, ListArgT extends object>(
  config: ListDataConfigT<ModelT, ListArgT>,
) {
  const [dataInfo, setDataInfo] = useState<ListDataT<ModelT, ListArgT>>({
    status: "idle",
    listArg: {} as ListArgT,
    data: [],
    nextCursor: null,
    appendingStatus: "idle",
    lastUpdated: null,
    lastKey: undefined,
  });

  return useListDataLogic(dataInfo, setDataInfo, config);
}

type setDataInfoT<StateT> = Dispatch<SetStateAction<StateT>>;

export function useListDataLogic<ModelT extends BaseModelT, ListDataArgT extends object>(
  dataInfo: ListDataT<ModelT, ListDataArgT>,
  setDataInfo: setDataInfoT<ListDataT<ModelT, ListDataArgT>>,
  { listFn, cacheCfg }: ListDataConfigT<ModelT, ListDataArgT>,
) {
  const {
    status,
    listArg: prevListArg,
    data,
    nextCursor,
    lastKey,
    lastUpdated,
  } = dataInfo;

  const isFinish = nextCursor == null;

  function patch(data: Partial<ListDataT<ModelT, ListDataArgT>>): void {
    setDataInfo((dataInfo) => {
      return {
        ...dataInfo,
        ...data,
      };
    });
  }

  async function load(listArg: ListDataArgT, loadOpt: LoadOptionT = {}): Promise<void> {
    if (status === "loading") {
      return;
    }
    const isForce = loadOpt.force ||
        !cacheCfg ||
        (lastKey !== cacheCfg.genKey(listArg)) ||
        (cacheCfg.ttl && lastUpdated && (new Date().getTime() - lastUpdated.getTime() > cacheCfg.ttl));
    if (status === "loaded" && !isForce ) {
      return;
    }
    try {
      if (!loadOpt.skipLoading) {
        patch({ status: "loading" });
      }
      const { data, nextCursor, numData } = await listFn(listArg);
      patch({
        status: "loaded",
        listArg,
        data,
        nextCursor,
        numData,
        appendingStatus: "loaded",
        lastUpdated: new Date(),
        lastKey: cacheCfg?.genKey(listArg),
      });
      if (loadOpt.onSuccess) {
        loadOpt.onSuccess();
      }
    } catch (e) {
      console.error(1234);
      // TODO 401 retry 정의
      // patch({ status: "error" });
    }
  }

  function reset(): void {
    patch({
      status: "idle",
      data: [],
    });
  }

  async function refill(): Promise<void> {
    if (status !== "loaded" || isFinish) {
      return;
    }
    try {
      patch({ appendingStatus: "loading" });
      const refillArg: ListDataArgT = { ...prevListArg, cursor: nextCursor };
      const rsp = await listFn(refillArg);
      patch({
        status: "loaded",
        appendingStatus: "loaded",
        data: [...data, ...rsp.data],
        nextCursor: rsp.nextCursor,
      });
    } catch (e) {
      patch({
        appendingStatus: "error",
      });
    }
  }

  function replaceItem(newItem: ModelT): void {
    if (status !== "loaded") {
      return;
    }
    const newData = replaceItem_(data, newItem, (item) => item.id == newItem.id);
    patch({
      ...dataInfo,
      data: newData,
    });
  }

  function filterItems(filter: (item: ModelT) => boolean): void {
    const newData = [...data].filter(filter);
    patch({
      ...dataInfo,
      data: newData,
    });
  }

  function splice(at: number, cut: number, ...items: ModelT[]): void {
    const newData = [...data];
    newData.splice(at, cut, ...items);
    patch({
      ...dataInfo,
      data: newData,
    });
  }

  const _data = {
    ...dataInfo,
    isFinish,
  };

  const actions = {
    load,
    reset,
    refill,
    patch,
    replaceItem,
    filterItems,
    splice,
  };

  return { data: _data, actions };
}
