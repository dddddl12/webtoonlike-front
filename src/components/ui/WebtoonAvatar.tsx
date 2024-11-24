import { Row } from "@/components/ui/common";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { Link } from "@/i18n/routing";
import { WebtoonPreviewT } from "@/resources/webtoons/dtos/webtoonPreview.dto";

export default function WebtoonAvatar({
  webtoon,
}: {
  webtoon: WebtoonPreviewT;
}) {
  const { id, thumbPath, localized: { title } } = webtoon;
  return <Row>
    <div className="w-16 h-16 overflow-hidden relative rounded-sm">
      <Image
        src={buildImgUrl(thumbPath, { size: "xxs" } )}
        alt={thumbPath}
        style={{ objectFit: "cover" }}
        fill
      />
    </div>
    <Link
      className="clickable ml-4"
      href={`/webtoons/${id}`}>
      {title}
    </Link>
  </Row>;
}