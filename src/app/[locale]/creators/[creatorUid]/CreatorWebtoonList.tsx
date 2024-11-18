"use client";

import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { listWebtoonsByUserId, WebtoonPreviewT } from "@/resources/webtoons/webtoon.service";
import WebtoonGridPaginated from "@/components/WebtoonGridPaginated";

export default function CreatorWebtoonList({ initialWebtoonListResponse, creatorUid }: {
  initialWebtoonListResponse: ListResponse<WebtoonPreviewT>;
  creatorUid: number;
}) {
  const { listResponse, filters, setFilters } = useListData(
    listWebtoonsByUserId, {
      page: 1,
      userId: creatorUid,
    }, initialWebtoonListResponse);

  return <WebtoonGridPaginated
    listResponse={listResponse}
    filters={filters}
    setFilters={setFilters}
  />;
}
