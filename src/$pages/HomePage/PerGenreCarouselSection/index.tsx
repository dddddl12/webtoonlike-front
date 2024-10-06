"use client";

import React, { useState } from "react";
import { Heading } from "@/ui/texts";
import { Col, Gap, Row } from "@/ui/layouts";

import { IconRightArrow } from "@/components/svgs/IconRightArrow";
import { PerGenreCarouselBox } from "./PerGenreCarouselBox";
import { GenreSelector } from "@/components/GenreSelector";
import type { GenreT } from "@/types";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function PerGenreCarouselSection() {
  const [selectedGenre, setSelectedGenre] = useState<GenreT | null>(null);
  const router = useRouter();
  const t = useTranslations("homeMain");

  return (
    <section className="w-full flex justify-center items-center">
      <Col className="w-full">
        <Row className="items-center justify-center">
          <Heading className="text-white text-[26pt] font-bold w-[1200px]">
            {t("organizedByGenre")}
            <div
              className="flex flex-row items-center justify-end text-[14pt] font-normal text-right cursor-pointer"
              onClick={() => {router.push("/webtoons");}}
            >
              {/* {Tgenres(selectedGenre?.label ?? "전체")} */}
              {t("seeMoreSeries")}
              <Gap x={2} />
              <IconRightArrow className="fill-white"/>
            </div>
          </Heading>
        </Row>

        <GenreSelector
          withAll
          selected={selectedGenre ? [selectedGenre] : []}
          onGenreSelect={(genre) => setSelectedGenre(genre)}
        />

        <Gap y="36px" />
        <PerGenreCarouselBox
          genre={selectedGenre}
        />
      </Col>
    </section>
  );
}
