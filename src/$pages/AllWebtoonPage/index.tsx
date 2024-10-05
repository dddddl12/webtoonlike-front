"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { WebtooonFeedList } from "@/$pages/buyers/BuyerHomePage/WebtoonFeedList";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/Select";
import { Heading } from "@/ui/texts";
import { useListData } from "@/hooks/ListData";
import * as GenreApi from "@/apis/genre";
import type { GenreT } from "@/types";
import type { ListWebtoonOptionT } from "@/types";

const STATUS = [
  { value: "all", label: "전체보기" },
  { value: "bidding", label: "오퍼중" },
  { value: "negotiating", label: "협상중" },
  { value: "done", label: "계약 완료" },
];
const GRADE = [
  { value: "all", label: "전체이용가" },
  { value: "12+", label: "12+" },
  { value: "15+", label: "15+" },
  { value: "18+", label: "18+" },
];

export function AllWebtoonPage() {
  const [bidStatus, setBidStatus] =
    useState<ListWebtoonOptionT["bidStatus"]>(undefined);
  const [genre, setGenre] = useState<null | GenreT>(null);
  const [ageLimit, setAgeLimit] =
    useState<ListWebtoonOptionT["ageLimit"]>(undefined);
  const TallSeries = useTranslations("allSeries");
  const TstatusData = useTranslations("statusData");
  const Tgenre = useTranslations("genre");
  const Tage = useTranslations("ageRestriction");
  const locale = useLocale();

  const { data: genres$, actions: genresAct } = useListData({
    listFn: GenreApi.list,
  });

  useEffect(() => {
    genresAct.load({});
  }, []);

  function handleGenreChange(genreValue: string): void {
    const cands = genres$.data ?? [];
    const found = cands.find((item) => item.id.toString() == genreValue);
    if (found) {
      setGenre(found);
    } else {
      setGenre(null);
    }
  }

  function handleAgeLimitChange(ageLimitValue: string): void {
    if (ageLimitValue == "all") {
      setAgeLimit(undefined);
    } else {
      setAgeLimit(ageLimitValue as ListWebtoonOptionT["ageLimit"]);
    }
  }

  function handleBidStatusChange(bidStatusValue: string): void {
    if (bidStatusValue == "all") {
      setBidStatus(undefined);
    } else {
      setBidStatus(bidStatusValue as ListWebtoonOptionT["bidStatus"]);
    }
  }

  return (
    <Container>
      <Col className="flex justify-center">
        <Gap y={20} />
        <Row className="w-[1200px]">
          <Heading className="text-white text-[32px] font-bold">
            {TallSeries("allSeries")}
          </Heading>
        </Row>
        <Gap y={10} />
        <Row>
          {/* <Select
              onValueChange={handleBidStatusChange}
            >
              <SelectTrigger className="w-[180px] bg-transparent text-white border-white">
                <SelectValue
                  placeholder={TallSeries("seriesType")}
                ></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{TallSeries("seriesType")}</SelectLabel>
                  {STATUS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {TstatusData(item.label)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Gap x={4} /> */}

          <Select onValueChange={handleGenreChange}>
            <SelectTrigger className="w-[180px] bg-transparent text-white border-white">
              <SelectValue placeholder={TallSeries("genre")}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{TallSeries("genre")}</SelectLabel>

                <SelectItem value={"all"}>
                  {locale === "ko" ? "전체" : "All"}
                </SelectItem>
                {genres$.status == "loaded" &&
                  genres$.data?.map((item) => (
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

          <Select onValueChange={handleAgeLimitChange}>
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
        <WebtooonFeedList
          genre={genre}
          bidStatus={bidStatus}
          ageLimit={ageLimit}
        />
        <Gap y={40} />
      </Col>
    </Container>
  );
}
