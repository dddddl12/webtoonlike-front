import Image from "next/image";
import { Gap, Grid, Row } from "@/shadcn/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import { Text } from "@/shadcn/ui/texts";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { displayName } from "@/utils/displayName";
import { ListResponse } from "@/resources/globalTypes";
import { Dispatch, SetStateAction } from "react";
import Paginator from "@/components/Paginator";
import { WebtoonPreviewT } from "@/resources/webtoons/webtoon.controller";

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
      return <></>;
    }
    return <Row className="justify-center bg-gray-darker p-3 rounded-sm">
      <Text className="text-white">
        {noItemsMessage}
      </Text>
    </Row>;
  }
  return <>
    <Grid className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
      {listResponse.items.map((item) =>
        <WebtoonPreview
          key={item.id}
          webtoon={item}
        />
      )}
    </Grid>
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
  const locale = useLocale();

  return (
    <Link className='mx-2 my-4' href={`/webtoons/${webtoon.id}`}>
      <div className='relative aspect-[3/4] w-full overflow-hidden rounded-md'>
        <Image
          src={buildImgUrl(webtoon.thumbPath, { size: "sm" })}
          alt={webtoon.thumbPath}
          fill
          style={{ objectFit: "cover" }}
          priority={true}
        />
      </div>

      <Gap y={5} />

      <Text className='text-[16pt] font-bold text-white'>
        {displayName(locale, webtoon.title, webtoon.title_en)}
      </Text>

      <Text className='text-[12pt] text-gray-text line-clamp-2'>
        {displayName(locale, webtoon.description, webtoon.description_en)}
      </Text>

      <Gap y={2} />
      {/*TODO*/}
      {/*{webtoon.authorId == tokenInfo?.userId && (*/}
      {/*  <Row>*/}
      {/*    <Text className="text-white bg-mint px-1 rounded-sm">{locale === "ko" ? "내 작품" : "My work" }</Text>*/}
      {/*  </Row>*/}
      {/*)}*/}
    </Link>
  );
}
