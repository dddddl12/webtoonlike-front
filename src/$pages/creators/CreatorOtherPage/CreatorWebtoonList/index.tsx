"use client";

import { WebtoonPreview } from "@/components/WebtoonPreview";
import { useListData } from "@/hooks/ListData";
import { CreatorT, ListWebtoonOptionT } from "@/types";
import { Grid, Row } from "@/ui/layouts";
import { Clickable } from "@/ui/tools/Clickable";
import { ListView } from "@/ui/tools/ListView";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import * as WebtoonApi from "@/apis/webtoons";
import { useMe } from "@/states/UserState";
import Spinner from "@/components/Spinner";
import { useRouter } from "@/i18n/routing";
import { Text } from "@/ui/texts";
import { ErrorComponent } from "@/components/ErrorComponent";

export default function CreatorWebtoonList({
  creator,
}: {
  creator: CreatorT;
  }): JSX.Element {
  const router = useRouter();
  const { data: webtoons$, actions: webtoonsAct } = useListData({
    listFn: async (listOpt) => {
      return await WebtoonApi.list(listOpt);
    },
  });

  const listOpt: ListWebtoonOptionT = {
    authorId: creator.userId,
    limit: 10,
    $creator: true,
  };

  useEffect(() => {
    webtoonsAct.load(listOpt);
  }, [JSON.stringify(listOpt)]);

  const { data: webtoons, status } = webtoons$;

  function handleLoaderDetect(): void {
    webtoonsAct.refill();
  }

  const me = useMe();

  const isLoading = (status: string) => status === "idle" || status === "loading";
  const isError = (status: string) => status === "error";

  if (isLoading(status) ) {
    return <Spinner />;
  }
  if (isError(status)) {
    return <ErrorComponent />;
  }

  return (
    <>
      {webtoons.length === 0 ?
        <Row className="justify-center items-center">
          <Text className="text-gray-shade">등록된 웹툰이 없습니다.</Text>
        </Row> :
        <Grid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <ListView
            data={webtoons}
            onLoaderDetect={handleLoaderDetect}
            renderItem={(webtoon) => {
              return (
                <Fragment key={webtoon.id}>
                  {creator.userId === webtoon.authorId && (
                    <Clickable>
                      <div
                        className="cursor-pointer"
                        onClick={() => {router.push(`/webtoons/${webtoon.id}`);}}>
                        <WebtoonPreview webtoon={webtoon} />
                      </div>
                    </Clickable>
                  )}
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
        </Grid>}
    </>
  );
}
