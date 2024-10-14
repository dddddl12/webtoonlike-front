"use client";

import { Fragment, useState } from "react";
import { Gap, Grid, Row } from "@/ui/layouts";
import { Clickable } from "@/ui/tools/Clickable";
import { WebtoonPreview } from "@/components/WebtoonPreview";
import type { ListWebtoonOptionT, GenreT, WebtoonT } from "@/types";
import Spinner from "@/components/Spinner";
import { useRouter } from "@/i18n/routing";
import { Pagenator } from "@/ui/tools/Pagenator";
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
import * as WebtoonApi from "@/apis/webtoons";

export type WebtoonList = {
  items: WebtoonT[];
  numData: number;
};

type WebtoonFeedListProps = {
  genres: GenreT[];
  initialWebtoonList: WebtoonList;
  itemsPerPage: number;
};

const GRADE = [
  { value: "all", label: "전체이용가" },
  { value: "12+", label: "12+" },
  { value: "15+", label: "15+" },
  { value: "18+", label: "18+" },
];

type AgeLimit = ListWebtoonOptionT["ageLimit"];
type Filters = {
    genreId?: number;
    ageLimit?: AgeLimit,
    page: number;
}


export function WebtooonFeedList({
  genres,
  initialWebtoonList,
  itemsPerPage
}: WebtoonFeedListProps) {
  const [filters, setFilters] = useState<Filters>({
    page: 0,
  });
  const [webtoonList, setWebtoonList] = useState<WebtoonList | undefined>(initialWebtoonList);

  // 번역
  const TallSeries = useTranslations("allSeries");
  const Tage = useTranslations("ageRestriction");
  const locale = useLocale();

  function handleChange(newFilters: Filters): void {
    setWebtoonList(undefined);
    setFilters(prev => ({
      ...prev, ...newFilters
    }));
    WebtoonApi.list({
      $numData: true,
      offset: filters.page * itemsPerPage,
      limit: itemsPerPage,
      genreId: filters.genreId,
      ageLimit: filters.ageLimit,
      // bidStatus: "bidding, negotiating, done", // TODO
    }).then(res => {
      setWebtoonList({
        items: res.data,
        numData: res.numData || 0
      });
    });
  }

  return (
    <>
      <Row>
        <Select onValueChange={(genreIdValue) => handleChange({
          genreId: Number(genreIdValue),
          page: 0
        })}>
          <SelectTrigger className="w-[180px] bg-transparent text-white border-white">
            <SelectValue placeholder={TallSeries("genre")}></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{TallSeries("genre")}</SelectLabel>

              <SelectItem value={"all"}>
                {locale === "ko" ? "전체" : "All"}
              </SelectItem>
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

        <Gap x={4} />

        <Select onValueChange={(ageLimitValue) => handleChange({
          // TODO 전체연령가 버그 확인 (ageLimitValue == "all")
          ageLimit: ageLimitValue as AgeLimit,
          page: 0
        })}>
          <SelectTrigger className="w-[180px] bg-transparent text-white border-white">
            <SelectValue
              placeholder={TallSeries("ageRestriction")}
            ></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{TallSeries("ageRestriction")}</SelectLabel>
              {GRADE.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {Tage(item.label)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Row>

      <Gap y={10} />
      <GridContainer
        webtoonList={webtoonList}
        page={filters.page}
        itemsPerPage={itemsPerPage}
        handleChange={handleChange}
      />
    </>
  );
}

function GridContainer({ webtoonList, page, itemsPerPage, handleChange }: {
  webtoonList?: WebtoonList;
  page: number;
  itemsPerPage: number;
  handleChange: (newFilters: Filters) => void;
}) {
  const router = useRouter();
  if (!webtoonList) {
    return <Spinner />;
  }
  return <>
    <Grid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {webtoonList.items.map((item) => (
        <Fragment key={item.id}>
          <Clickable>
            <div
              onClick={() => {
                router.push(`/webtoons/${item.id}`);
              }}
            >
              <WebtoonPreview webtoon={item} />
            </div>
          </Clickable>
        </Fragment>
      ))}
    </Grid>
    <Pagenator
      page={page}
      numData={webtoonList.numData}
      itemsPerPage={itemsPerPage}
      pageWindowLen={2}
      onPageChange={(page) => handleChange({ page })}
    />
  </>;
}