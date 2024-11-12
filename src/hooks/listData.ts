import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ListResponse } from "@/resources/globalTypes";

export function useListData<Filters, ResourceType>(
  listFetcherFunction: (filters: Filters) => Promise<ListResponse<ResourceType>>,
  initialFilters: Filters,
): {
  listResponse: ListResponse<ResourceType> | undefined;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};

export function useListData<Filters, ResourceType>(
  listFetcherFunction: (filters: Filters) => Promise<ListResponse<ResourceType>>,
  initialFilters: Filters,
  initialResponse: ListResponse<ResourceType>
): {
  listResponse: ListResponse<ResourceType>;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};

export function useListData<Filters, ResourceType>(
  listFetcherFunction: (filters: Filters) => Promise<ListResponse<ResourceType>>,
  initialFilters: Filters,
  initialResponse?: ListResponse<ResourceType>
): {
    listResponse: ListResponse<ResourceType> | undefined;
    filters: Filters;
    setFilters: Dispatch<SetStateAction<Filters>>;
  } {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [listResponse, setListResponse] = useState<ListResponse<ResourceType>|undefined>(initialResponse);

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current && initialResponse) {
      // Skip the effect during the initial render
      isInitialRender.current = false;
      return;
    }
    listFetcherFunction(filters).then(setListResponse);
  }, [filters, initialResponse, listFetcherFunction]);
  return { listResponse, filters, setFilters };
}