import { IconHeart } from "@/components/svgs/IconHeart";
import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import { Row } from "@/shadcn/ui/layouts";
import { useState } from "react";
import { toggleLike } from "@/resources/webtoonLikes/webtoonLike.service";
import { WebtoonLikeWithMineT } from "@/resources/webtoonLikes/webtoonLike.types";
import { Button } from "@/shadcn/ui/button";
import useSafeAction from "@/hooks/safeAction";

// TODO buyer만 가능한가?
export default function WebtoonDetailsLikeButton({
  initWebtoonLike, hasRightToOffer,
}: {
  initWebtoonLike: WebtoonLikeWithMineT;
  hasRightToOffer: boolean;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [webtoonLike, setWebtoonLike] = useState(initWebtoonLike);
  const { execute } = useSafeAction(toggleLike.bind(null, webtoonLike.webtoonId), {
    onSettled: () => setIsProcessing(false),
    onSuccess: ({ data }) => {
      if (!data) {
        throw new Error("data is null");
      }
      setWebtoonLike(data);
    }
  });

  return <Row>
    <Button disabled={isProcessing || !hasRightToOffer} asChild size="smallIcon" className="bg-tranparent hover:bg-transparent">
      {/*todo hover logic*/}
      {webtoonLike.myLike
        ? <IconHeartFill onClick={() => {
          setIsProcessing(true);
          execute({ action: "unlike" });
        }} className="fill-red hover:fill-red/80"/>
        : <IconHeart onClick={() => {
          setIsProcessing(true);
          execute({ action: "like" });
        }} className="fill-white hover:fill-red" />}
    </Button>
    <span className="ml-2.5">{webtoonLike.likeCount}</span>
  </Row>;
}
