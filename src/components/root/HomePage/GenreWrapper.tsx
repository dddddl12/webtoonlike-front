"use client";
import { HomeItemsT, HomeWebtoonItem } from "@/resources/home/home.dto";
import { Badge } from "@/shadcn/ui/badge";
import { useEffect, useRef, useState } from "react";
import WebtoonGrid from "@/components/root/HomePage/WebtoonGrid";
import { clsx } from "clsx";
import { getPerGenreItems } from "@/resources/home/home.controller";
import { Row } from "@/components/ui/common";

export default function GenreWrapper({
  genres, firstGenreItems
}: HomeItemsT["genreSets"]) {
  const [genreId, setGenreId] = useState<number>(genres[0].id);
  const [webtoons, setWebtoons] = useState<HomeWebtoonItem[]>(firstGenreItems ?? []);

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      // Skip the effect during the initial render
      isInitialRender.current = false;
      return;
    }
    getPerGenreItems({
      genreId
    }).then(res => {
      if (!res?.data) {
        throw new Error("data is null");
      }
      setWebtoons(res.data);
    });
  }, [genreId]);

  return <>
    <Row className="gap-2">
      {genres.map((genre) => {
        const isActive = genre.id === genreId;
        return <Badge
          key={genre.id}
          variant={isActive ? "default" : "outline"}
          onClick={() => setGenreId(genre.id)}
          className={clsx("text-sm", {
            "cursor-pointer": !isActive,
          })}
        >
          {genre.localized.label}
        </Badge>;
      })}
    </Row>
    <WebtoonGrid webtoons={webtoons} className="mt-9" />
  </>;
}
