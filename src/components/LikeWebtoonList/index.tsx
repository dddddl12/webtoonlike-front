import { Fragment } from "react";
import { Col, Gap, Grid, Row } from "@/ui/layouts";
import { Clickable } from "@/ui/tools/Clickable";
import { WebtoonPreview } from "@/components/WebtoonPreview";
import * as WebtoonApi from "@/apis/webtoons";
import { useListData } from "@/hooks/ListData";
import type { ListWebtoonOptionT } from "@/types";
import { ListView } from "@/ui/tools/ListView";
import Spinner from "@/components/Spinner";
import { useLocale } from "next-intl";
import { Text } from "@/ui/texts";
import { ErrorComponent } from "../ErrorComponent";
import { useRouter } from "@/i18n/routing";

export function LikeWebtoonList() {
  const router = useRouter();
  const locale = useLocale();

  const { data: webtoons$, actions: webtoonsAct } = useListData({
    listFn: async (listOpt) => {
      return await WebtoonApi.list(listOpt);
    },
  });

  const listOpt: ListWebtoonOptionT = {
    limit: 10,
    like: "only"
  };

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
    <Col>
      <Text className="text-white text-2xl font-bold">{locale === "ko" ? "좋아요 표시한 웹툰" : "Liked Webtoons"}</Text>
      <Gap y={10} />
      {webtoons.length > 0 ? <Grid className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        <ListView
          data={webtoons}
          onLoaderDetect={handleLoaderDetect}
          renderItem={(webtoon, idx) => {
            return (
              <Fragment key={webtoon.id}>
                <Clickable>
                  <div className="cursor-pointer" onClick={() => {router.push(`/webtoons/${webtoon.id}`);}}>
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
      </Grid> : <Row className="justify-center bg-gray-darker p-3 rounded-sm">
        <Text className="text-white">{locale === "ko" ? "좋아요 표시한 웹툰이 없습니다." : "No liked webtoons."}</Text>
      </Row>}
    </Col>
  );
}

