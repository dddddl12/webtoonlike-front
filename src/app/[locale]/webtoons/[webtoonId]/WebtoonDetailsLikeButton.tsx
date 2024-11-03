"use client";

import { IconHeart } from "@/components/svgs/IconHeart";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import { Row } from "@/ui/layouts";
import { useState } from "react";
import { createLike, deleteLike } from "@/resources/webtoonLikes/webtoonLike.service";
import { WebtoonLikeT } from "@/resources/webtoonLikes/webtoonLike.types";

// TODO buyer만 가능한가?
export default function WebtoonDetailsLikeButton({
  initWebtoonLike,
}: {
  initWebtoonLike: WebtoonLikeT;
}) {
  const [webtoonLike, setWebtoonLike] = useState(initWebtoonLike);

  async function handleClickLike(): Promise<void> {
    const newWebtoonLike = await createLike(webtoonLike.webtoonId);
    setWebtoonLike(newWebtoonLike);
  }

  async function handleClickUnlike(): Promise<void> {
    const newWebtoonLike = await deleteLike(webtoonLike.webtoonId);
    setWebtoonLike(newWebtoonLike);
  }
  return <Row>
    {webtoonLike.myLike
      ? <IconHeartFill onClick={handleClickUnlike} className="fill-red cursor-pointer"/>
      : <IconHeart onClick={handleClickLike} className="fill-white cursor-pointer" />}
    <span className="ml-2.5">{webtoonLike.likeCount}</span>
  </Row>;
}
