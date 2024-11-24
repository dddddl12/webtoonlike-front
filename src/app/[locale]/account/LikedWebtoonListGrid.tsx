"use client";

import { useTranslations } from "next-intl";
import { ListResponse } from "@/resources/globalTypes";
import useListData from "@/hooks/listData";
import WebtoonGridPaginated from "@/components/shared/WebtoonGridPaginated";
import { WebtoonPreviewT } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import { listLikedWebtoons } from "@/resources/webtoons/controllers/webtoonPreview.controller";

export default function LikedWebtoonListGrid({ initialMyLikesListResponse }: {
  initialMyLikesListResponse: ListResponse<WebtoonPreviewT>;
}) {
  const t = useTranslations("accountPage.myLikes");
  const { listResponse, filters, setFilters } = useListData(
    listLikedWebtoons, { page: 1 }, initialMyLikesListResponse);

  return <WebtoonGridPaginated
    listResponse={listResponse}
    filters={filters}
    setFilters={setFilters}
    noItemsMessage={t("noLikedWebtoons")}
  />;
}
