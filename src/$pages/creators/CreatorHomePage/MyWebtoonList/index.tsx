"use client";

import { Fragment } from "react";
import { Grid } from "@/ui/layouts";
import { Clickable } from "@/ui/tools/Clickable";
import { WebtoonPreview } from "@/components/WebtoonPreview";
import * as WebtoonApi from "@/apis/webtoons";
import { useListData } from "@/hooks/ListData";
import type { ListWebtoonOptionT } from "@/types";
import { ListView } from "@/ui/tools/ListView";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useRouter } from "@/i18n/routing";

export function MyWebtooonList({ userId }: {
  userId: number;
}) {
  const router = useRouter();

  const { data: webtoons$, actions: webtoonsAct } = useListData({
    listFn: async (listOpt) => {
      return await WebtoonApi.list(listOpt);
    },
  });

  const listOpt: ListWebtoonOptionT = {
    authorId: userId,
    limit: 10,
  };

  // TODO 발생 불가
  webtoonsAct.load(listOpt);

  function handleLoaderDetect(): void {
    webtoonsAct.refill();
  }

  const { status, data: webtoons } = webtoons$;

  if (status == "idle" || status == "loading") {
    return <Spinner />;
  }
  if (status == "error") {
    return <ErrorComponent />;
  }
  return (
    <Grid className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
      <ListView
        data={webtoons}
        onLoaderDetect={handleLoaderDetect}
        renderItem={(webtoon, idx) => {
          return (
            <Fragment key={webtoon.id}>
              <Clickable>
                <div
                  className="cursor-pointer"
                  onClick={() => {router.push(`/webtoons/${webtoon.id}`);}}>
                  <WebtoonPreview webtoon={webtoon} />
                </div>
              </Clickable>
            </Fragment>
          );
        }}
        renderAppend={() => {
          if (webtoons$.appendingStatus == "loading") {
            return <Spinner />;
          }
          return null;
        }}
      />
    </Grid>
  );
}
