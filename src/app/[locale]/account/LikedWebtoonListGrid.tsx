"use client";

import { Grid, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { useTranslations } from "next-intl";
import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { WebtoonPreview } from "@/components/WebtoonPreview";
import { WebtoonPreviewT } from "@/resources/webtoons/webtoon.types";
import { listLikedWebtoons } from "@/resources/webtoons/webtoon.service";
import { Paginator } from "@/ui/tools/Paginator";

export default function LikedWebtoonListGrid({ initialMyLikesListResponse }: {
  initialMyLikesListResponse: ListResponse<WebtoonPreviewT>
}) {
  const t = useTranslations("accountPage.myLikes");
  const { listResponse, filters, setFilters } = useListData(
    listLikedWebtoons, { page: 1 }, initialMyLikesListResponse);

  if (listResponse.items.length === 0) {
    return <Row className="justify-center bg-gray-darker p-3 rounded-sm">
      <Text className="text-white">
        {t("noLikedWebtoons")}
      </Text>
    </Row>;
  }

  return <>
    <Grid className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
      {listResponse.items.map((item) =>
        <WebtoonPreview
          key={item.id}
          webtoon={item}
        />
      )}
    </Grid>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}
