"use client";

import { ListResponse } from "@/resources/globalTypes";
import useListData from "@/hooks/listData";
import WebtoonGridPaginated from "@/components/shared/WebtoonGridPaginated";
import { WebtoonPreviewT } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { listWebtoonsByUserId } from "@/resources/webtoons/controllers/webtoonPreview.controller";

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
