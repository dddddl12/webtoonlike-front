"use client";

import { Gap, Row } from "@/shadcn/ui/layouts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/shadcn/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { AgeLimit } from "@/resources/webtoons/webtoon.types";
import { BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { listWebtoons, WebtoonPreviewT } from "@/resources/webtoons/webtoon.service";
import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { displayName } from "@/utils/displayName";
import WebtoonGridPaginated from "@/components/WebtoonGridPaginated";
import { BasicGenreT } from "@/resources/genres/genre.service";

type Filters = {
  statuses?: BidRoundStatus[];
  genreId?: number;
  ageLimit?: AgeLimit;
  page: number;
};

export default function WebtooonFeedList({
  genres, initialWebtoonListResponse,
}: {
  genres: BasicGenreT[];
  initialWebtoonListResponse: ListResponse<WebtoonPreviewT>;
}) {

  const initialFilters: Filters = {
    page: 1
  };
  const { listResponse, filters, setFilters } = useListData(
    listWebtoons, initialFilters, initialWebtoonListResponse);

  function handleChange(newFilters: Filters) {
    setFilters(prev => ({
      ...prev, ...newFilters
    }));
  }

  return (
    <>
      <Row className="gap-4">
        <GenreSelector handleChange={handleChange} genres={genres}/>
        <AgeLimitSelector handleChange={handleChange}/>
      </Row>

      <Gap y={10} />

      <WebtoonGridPaginated
        listResponse={listResponse}
        filters={filters}
        setFilters={setFilters}
        noItemsMessage="관련 웹툰 없음" //TODO
      />
    </>
  );
}

function GenreSelector({
  genres, handleChange,
}: {
  genres: BasicGenreT[];
  handleChange: (newFilters: Filters) => void;
}) {
  const locale = useLocale();
  const TallSeries = useTranslations("allSeries");

  return <Select onValueChange={(genreIdValue) => handleChange({
    genreId: Number(genreIdValue),
    page: 1
  })}>
    <SelectTrigger className="w-[180px] bg-transparent text-white border-white">
      <SelectValue placeholder={TallSeries("genre")}/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{TallSeries("genre")}</SelectLabel>
        {genres.map((item) => (
          <SelectItem key={item.id} value={`${item.id}`}>
            {displayName(locale, item.label, item.label_en)}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>;
}

function AgeLimitSelector({
  handleChange,
}: {
  handleChange: (newFilters: Filters) => void;
}) {
  const TallSeries = useTranslations("allSeries");
  const Tage = useTranslations("ageRestriction");

  return <Select onValueChange={(ageLimitValue) => handleChange({
    ageLimit: ageLimitValue as AgeLimit,
    page: 1
  })}>
    <SelectTrigger className="w-[180px] bg-transparent text-white border-white">
      <SelectValue placeholder={TallSeries("ageRestriction")}/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{TallSeries("ageRestriction")}</SelectLabel>
        {Object.values(AgeLimit).map((item) => (
          <SelectItem key={item} value={item}>
            {Tage(item)}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>;
}
