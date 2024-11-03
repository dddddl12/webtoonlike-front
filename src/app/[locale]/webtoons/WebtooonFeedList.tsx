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
import { AgeLimit, WebtoonT } from "@/resources/webtoons/webtoon.types";
import { GenreT } from "@/resources/genres/genre.types";
import { BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { listWebtoons } from "@/resources/webtoons/webtoon.service";
import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";

type Filters = {
  statuses?: BidRoundStatus[];
  genreId?: number;
  ageLimit?: AgeLimit,
  page: number;
}

type WebtoonListResponse = ListResponse<WebtoonT>;

export default function WebtooonFeedList({
  genres,
  initialWebtoonListResponse,
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

  // 번역
  const TallSeries = useTranslations("allSeries");
  const Tage = useTranslations("ageRestriction");
  const Tstatus = useTranslations("bidRoundStatus");
  const locale = useLocale();

  return (
    <>
      <Row className="gap-4">
        <Select onValueChange={(status) => handleChange({
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
        </Select>

        <Select onValueChange={(genreIdValue) => handleChange({
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
                  {locale === "ko"
                    ? item.label
                    : item.label_en ?? item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(ageLimitValue) => handleChange({
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
        </Select>
      </Row>

      <Gap y={10} />
      <Grid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {listResponse.items.map((item) =>
          <WebtoonPreview
            key={item.id}
            webtoon={item}
            href={`/webtoons/${item.id}`}
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
