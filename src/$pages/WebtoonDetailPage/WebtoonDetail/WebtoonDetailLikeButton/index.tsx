"use client";

import { IconHeart } from "@/components/svgs/IconHeart";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import { Gap } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

type WebtoonDetailProps = {
  webtoon: WebtoonT;
};

export function WebtoonDetailLikeButton({
  webtoon: initWebtoon,
}: WebtoonDetailProps) {
  const [webtoon, setWebtoon] = useState(initWebtoon);

  const getOpt: GetWebtoonOptionT = {
    $myLike: true,
    $bidRounds: true,
    $episodes: true,
    $creator: true,
    $genres: true,
    $numRequest: true,
  };

  useEffect(() => {
    fetchWebtoon();
  }, []);

  async function fetchWebtoon() {
    try {
      const updatedWebtoon = await WebtoonApi.get(webtoon.id, getOpt);
      setWebtoon(updatedWebtoon.data);
    } catch (error) {
      console.error("Failed to fetch webtoon data:", error);
    }
  }
  async function handleClickLike(): Promise<void> {
    try {
      const form: WebtoonLikeFormT = {
        webtoonId: webtoon.id
      };
      await WebtoonLike.create(form);
      const newWebtoon: WebtoonT = { ...webtoon, myLike: true, numLike: webtoon.numLike + 1 };
      setWebtoon(newWebtoon);
      await fetchWebtoon();
    } catch (e){
      enqueueSnackbar("알 수 없는 에러가 발생했습니다.", { variant: "warning" });
    }
  }

  async function handleClickUnlike(): Promise<void> {
    try {
      if (webtoon.myLike) {
        await WebtoonLike.remove(webtoon.id);
        const newWebtoon: WebtoonT = { ...webtoon, myLike: false, numLike: webtoon.numLike - 1 };
        setWebtoon(newWebtoon);
        await fetchWebtoon();
      }
    } catch (e){
      enqueueSnackbar("알 수 없는 에러가 발생했습니다.", { variant: "warning" });
    }
  }

  return (
    <>
      {webtoon.myLike
        ? <Button onClick={handleClickUnlike} className="w-full bg-gray-dark text-white rounded-sm hover:bg-red">
          {webtoon.numLike}<Gap x={2} /><IconHeartFill fill="red"/>
        </Button>
        : <Button onClick={handleClickLike} className="w-full bg-gray-dark text-white rounded-sm hover:bg-red">
          {webtoon.numLike}<Gap x={2} /><IconHeart className="fill-white" />
        </Button>
      }
    </>
  );
}
