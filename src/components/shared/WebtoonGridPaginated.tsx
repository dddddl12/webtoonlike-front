import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import { Link } from "@/i18n/routing";
import { ListResponse } from "@/resources/globalTypes";
import { Dispatch, SetStateAction } from "react";
import Paginator from "@/components/ui/Paginator";
import { WebtoonPreviewT } from "@/resources/webtoons/dtos/webtoonPreview.dto";
import NoItems from "@/components/ui/NoItems";

// todo
// type Filters = {
//   page?: number;
//   [extraKey: string]: any;
// };
type Filters = any;

export default function WebtoonGridPaginated({ listResponse, filters, setFilters, noItemsMessage }: {
  listResponse: ListResponse<WebtoonPreviewT>;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  noItemsMessage?: string;
}) {

  if (listResponse.items.length === 0) {
    if (!noItemsMessage) {
      return null;
    }
    return <NoItems message={noItemsMessage} />;
  }
  return <>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7">
      {listResponse.items.map((item) =>
        <WebtoonPreview
          key={item.id}
          webtoon={item}
        />
      )}
    </div>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}

function WebtoonPreview({ webtoon }: {
  webtoon: WebtoonPreviewT;
}) {
  return (
    <Link href={`/webtoons/${webtoon.id}`}>
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md">
        <Image
          src={buildImgUrl(webtoon.thumbPath, { size: "sm" })}
          alt={webtoon.thumbPath}
          fill
          className="rounded-md"
          style={{ objectFit: "cover" }}
          priority={true}
        />
      </div>

      <p className="mt-4 font-bold">
        {webtoon.localized.title}
      </p>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {webtoon.localized.description}
      </p>

      {/*TODO*/}
      {/*{webtoon.authorId == tokenInfo?.userId && (*/}
      {/*  <Row>*/}
      {/*    <p className="bg-mint px-1 rounded-sm">{locale === "ko" ? "내 작품" : "My work" }</p>*/}
      {/*  </Row>*/}
      {/*)}*/}
    </Link>
  );
}
