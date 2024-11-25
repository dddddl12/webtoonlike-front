"use client";

import { ListResponse } from "@/resources/globalTypes";
import useListData from "@/hooks/listData";
import WebtoonGridPaginated from "@/components/shared/WebtoonGridPaginated";
import { WebtoonPreviewT } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { listWebtoonsByUserId } from "@/resources/webtoons/controllers/webtoonPreview.controller";
import { useMemo } from "react";

export default function CreatorWebtoonList({ initialWebtoonListResponse, creatorUid }: {
  initialWebtoonListResponse: ListResponse<WebtoonPreviewT>;
  creatorUid: number;
}) {
  const boundListWebtoonsByUserId = useMemo(() => listWebtoonsByUserId.bind(null, creatorUid), [creatorUid]);
  const { listResponse, filters, setFilters } = useListData(
    boundListWebtoonsByUserId, {
      page: 1
    }, initialWebtoonListResponse);

  return <WebtoonGridPaginated
    listResponse={listResponse}
    filters={filters}
    setFilters={setFilters}
  />;
}
