"use client";

import { useEffect, Fragment, useState } from "react";
import Link from "next/link";
import { Grid } from "@/ui/layouts";
import { Clickable } from "@/ui/tools/Clickable";
import { WebtoonPreview } from "@/components/WebtoonPreview";
import * as WebtoonApi from "@/apis/webtoons";
import { useListData } from "@/hooks/ListData";
import { useMe } from "@/states/UserState";
import { ListView } from "@/ui/tools/ListView";
import { sleep } from "@/utils/misc";
import type { ListWebtoonOptionT, GenreT } from "@/types";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useRouter } from "@/i18n/routing";
import { Pagenator } from "@/ui/tools/Pagenator";

type WebtoonFeedListProps = {
  genre?: GenreT | null;
  bidStatus?: ListWebtoonOptionT["bidStatus"];
  ageLimit?: ListWebtoonOptionT["ageLimit"];
};

export function WebtooonFeedList({
  genre,
  bidStatus,
  ageLimit,
}: WebtoonFeedListProps) {
  const router = useRouter();
  const { data: webtoons$, actions: webtoonsAct } = useListData({
    listFn: async (listOpt) => {
      return await WebtoonApi.list(listOpt);
    },
  });

  const [page, setPage] = useState<number>(0);
  const pageWindowLen = 2;
  const itemPerPage = 10;
  const totalNumdata = webtoons$.numData || 0;

  function handlePageClick(page: number) {
    setPage(page);
  }

  const listOpt: ListWebtoonOptionT = {
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
    genreId: genre?.id,
    bidStatus: bidStatus ?? "bidding, negotiating, done",
    ageLimit: ageLimit,
  };

  useEffect(() => {
    webtoonsAct.load(listOpt);
  }, [page, genre, ageLimit]);

  const { status, data: webtoons } = webtoons$;

  if (status == "idle" || status == "loading") {
    return <Spinner />;
  }
  if (status == "error") {
    return <ErrorComponent />;
  }
  return (
    <>
      <Grid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {webtoons.map((item) => (
          <Fragment key={item.id}>
            <Clickable>
              <div
                onClick={() => {
                  router.push(`/webtoons/${item.id}`);
                }}
              >
                <WebtoonPreview webtoon={item} />
              </div>
            </Clickable>
          </Fragment>
        ))}
      </Grid>
      <Pagenator
        page={page}
        numData={totalNumdata}
        itemPerPage={itemPerPage}
        pageWindowLen={pageWindowLen}
        onPageChange={handlePageClick}
      />
    </>
  );
}
