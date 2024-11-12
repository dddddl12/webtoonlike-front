"use client";
import { HomeGenreItem, HomeWebtoonItem } from "@/resources/home/home.types";
import { Badge } from "@/shadcn/ui/badge";
import { displayName } from "@/utils/displayName";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import WebtoonGrid from "@/components/HomePage/WebtoonGrid";
import { getPerGenre } from "@/resources/home/home.service";
import { clsx } from "clsx";

export default function GenreWrapper({
  genres, firstGenreItems
}: {
  genres: HomeGenreItem[];
  firstGenreItems?: HomeWebtoonItem[];
}) {
  const locale = useLocale();
  const [genreId, setGenreId] = useState<number>(genres[0].id);
  const [webtoons, setWebtoons] = useState<HomeWebtoonItem[]>(firstGenreItems ?? []);

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      // Skip the effect during the initial render
      isInitialRender.current = false;
      return;
    }
    getPerGenre(genreId)
      .then(newPerGenreItems => setWebtoons(newPerGenreItems));
  }, [genreId]);

  return <>
    <div>
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
          {displayName(locale, genre.label, genre.label_en)}
        </Badge>;
      })}
    </div>
    <WebtoonGrid webtoons={webtoons} className="mt-9" />
  </>;
}
