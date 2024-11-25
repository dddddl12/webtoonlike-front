import { IconHeartFill } from "@/components/svgs/IconHeartFill";
import { Button } from "@/shadcn/ui/button";

export default function LikeBadge({ likeCount }: {
  likeCount: number;
}) {
  return <Button variant="secondary" className="cursor-default">
    {likeCount}
    <IconHeartFill fill="red" />
  </Button>;
}