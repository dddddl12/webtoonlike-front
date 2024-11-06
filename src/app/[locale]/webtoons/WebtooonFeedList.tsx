"use client";

import { Gap, Grid, Row } from "@/ui/layouts";
import { WebtoonPreview } from "@/components/WebtoonPreview";
import { Paginator } from "@/ui/tools/Paginator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/ui/shadcn/Select";
import { useLocale, useTranslations } from "next-intl";
import { AgeLimit, WebtoonPreviewT, WebtoonT } from "@/resources/webtoons/webtoon.types";
import { GenreT } from "@/resources/genres/genre.types";
import { BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { listWebtoons } from "@/resources/webtoons/webtoon.service";
import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { displayName } from "@/utils/displayName";

type Filters = {
  statuses?: BidRoundStatus[];
  genreId?: number;
  ageLimit?: AgeLimit,
  page: number;
}

type WebtoonListResponse = ListResponse<WebtoonPreviewT>;

export default function WebtooonFeedList({
  genres, initialWebtoonListResponse,
}: {
  genres: GenreT[];
  initialWebtoonListResponse: WebtoonListResponse;
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
        <TypeSelector handleChange={handleChange}/>
        <GenreSelector handleChange={handleChange} genres={genres}/>
        <AgeLimitSelector handleChange={handleChange}/>
      </Row>

      <Gap y={10} />
      <Grid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
    </>
  );
}

function TypeSelector({
  handleChange,
}: {
  handleChange: (newFilters: Filters) => void;
}) {
  const TallSeries = useTranslations("allSeries");
  const Tstatus = useTranslations("bidRoundStatus");

  return <Select onValueChange={(status) => handleChange({
    statuses: [status] as BidRoundStatus[],
    page: 1
  })}>
    {/*TODO select 해제*/}
    <SelectTrigger className="w-[180px] bg-transparent text-white border-white">
      <SelectValue placeholder={TallSeries("seriesType")}/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{TallSeries("seriesType")}</SelectLabel>
        {Object.values(BidRoundStatus).map((item) => {
          if ([BidRoundStatus.Idle, BidRoundStatus.Waiting].includes(item)) {
            // TODO 기획 확인
            return null;
          }
          return <SelectItem key={item} value={item}>
            {Tstatus(item)}
          </SelectItem>;
        })}
      </SelectGroup>
    </SelectContent>
  </Select>;
}

function GenreSelector({
  genres, handleChange,
}: {
  genres: GenreT[];
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
