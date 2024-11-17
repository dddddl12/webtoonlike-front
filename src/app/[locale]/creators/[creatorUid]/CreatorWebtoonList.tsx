"use client";

import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { listWebtoons, WebtoonPreviewT } from "@/resources/webtoons/webtoon.service";
import WebtoonGridPaginated from "@/components/WebtoonGridPaginated";

export default function CreatorWebtoonList({ initialWebtoonListResponse, creatorUid }: {
  initialWebtoonListResponse: ListResponse<WebtoonPreviewT>;
  creatorUid: number;
}) {
  const { listResponse, filters, setFilters } = useListData(
    listWebtoons, {
      page: 1,
      userId: creatorUid,
    } as {
      page: number;
      userId?: number;
    }, initialWebtoonListResponse);

  return <WebtoonGridPaginated
    listResponse={listResponse}
    filters={filters}
    setFilters={setFilters}
  />;
}
