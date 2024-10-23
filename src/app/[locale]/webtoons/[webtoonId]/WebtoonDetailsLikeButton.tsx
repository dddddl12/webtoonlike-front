import { IconHeart } from "@/components/svgs/IconHeart";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import { Gap } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { useState } from "react";
import { createLike, deleteLike } from "@/resources/webtoonLikes/webtoonLike.service";
import { WebtoonLikeT } from "@/resources/webtoonLikes/webtoonLike.types";

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

  return (
    <>
      {webtoonLike.myLike
        ? <Button onClick={handleClickUnlike} className="w-full bg-gray-dark text-white rounded-sm hover:bg-red">
          {webtoonLike.likes}<Gap x={2} /><IconHeartFill fill="red"/>
        </Button>
        : <Button onClick={handleClickLike} className="w-full bg-gray-dark text-white rounded-sm hover:bg-red">
          {webtoonLike.likes}<Gap x={2} /><IconHeart className="fill-white" />
        </Button>
      }
    </>
  );
}
