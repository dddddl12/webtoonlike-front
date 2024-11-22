"use client";
import { HomeGenreItem, HomeWebtoonItem } from "@/resources/home/home.types";
import { Badge } from "@/shadcn/ui/badge";
import { displayName } from "@/utils/displayName";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import WebtoonGrid from "@/components/HomePage/WebtoonGrid";
import { clsx } from "clsx";
import { getPerGenreItems } from "@/resources/home/home.controller";
import useSafeAction from "@/hooks/safeAction";
import { Row } from "@/shadcn/ui/layouts";

export default function GenreWrapper({
  genres, firstGenreItems
}: {
  genres: HomeGenreItem[];
  firstGenreItems?: HomeWebtoonItem[];
}) {
  const locale = useLocale();
  const [genreId, setGenreId] = useState<number>(genres[0].id);
  const [webtoons, setWebtoons] = useState<HomeWebtoonItem[]>(firstGenreItems ?? []);

  const { execute } = useSafeAction(getPerGenreItems, {
    onSuccess: ({ data }) => {
      if (!data) {
        throw new Error("data is null");
      }
      setWebtoons(data);
    }
  });

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      // Skip the effect during the initial render
      isInitialRender.current = false;
      return;
    }
    execute({
      genreId
    });
  }, [genreId, execute]);

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
          {displayName(locale, genre.label, genre.label_en)}
        </Badge>;
      })}
    </Row>
    <WebtoonGrid webtoons={webtoons} className="mt-9" />
  </>;
}
