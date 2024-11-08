"use client";

import { useTranslations } from "next-intl";
import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { WebtoonPreviewT } from "@/resources/webtoons/webtoon.types";
import { listLikedWebtoons } from "@/resources/webtoons/webtoon.service";
import WebtoonGridPaginated from "@/components/WebtoonGridPaginated";

export default function LikedWebtoonListGrid({ initialMyLikesListResponse }: {
  initialMyLikesListResponse: ListResponse<WebtoonPreviewT>
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
