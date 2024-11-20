import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { InferIn, Schema } from "next-safe-action/adapters/types";
import { HookSafeActionFn } from "next-safe-action/hooks";
import useSafeAction from "@/hooks/safeAction";
import { ActionErrorT } from "@/handlers/errors";

type Filters<
  S extends Schema | undefined,
> = S extends Schema ? InferIn<S> : void;

export default function useListData<
  ServerError extends ActionErrorT,
  S extends Schema | undefined,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data
>(
  listFetcherFunction: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  initialFilters: Filters<S>,
): {
  listResponse?: Data;
  filters: Filters<S>;
  setFilters: Dispatch<SetStateAction<Filters<S>>>;
};

export default function useListData<
  ServerError extends ActionErrorT,
  S extends Schema | undefined,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data
>(
  listFetcherFunction: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  initialFilters: Filters<S>,
  initialResponse: Data
): {
  listResponse: Data;
  filters: Filters<S>;
  setFilters: Dispatch<SetStateAction<Filters<S>>>;
};

export default function useListData<
  ServerError extends ActionErrorT,
  S extends Schema | undefined,
  BAS extends readonly Schema[],
  CVE,
  CBAVE,
  Data
>(
  listFetcherFunction: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  initialFilters: Filters<S>,
  initialResponse?: Data
): {
    listResponse?: Data;
    filters: Filters<S>;
    setFilters: Dispatch<SetStateAction<Filters<S>>>;
  } {

  const [filters, setFilters] = useState<Filters<S>>(initialFilters);
  const [listResponse, setListResponse] = useState(initialResponse);

  const { execute } = useSafeAction(
    listFetcherFunction,
    {
      onSuccess: ({ data }) => {
        setListResponse(data);
      }
    }
  );

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current && initialResponse) {
      // Skip the effect during the initial render
      isInitialRender.current = false;
      return;
    }
    execute(filters);
  }, [execute, filters, initialResponse]);

  return { listResponse, filters, setFilters };
}
