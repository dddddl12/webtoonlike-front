import { Col, Row } from "@/ui/layouts";
import { WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import { Link } from "@/i18n/routing";
import ContractRangeBasic from "@/app/[locale]/webtoons/[webtoonId]/ContractRangeBasic";
import React from "react";
import { getTranslations } from "next-intl/server";
import ContractRangeCountries from "@/app/[locale]/webtoons/[webtoonId]/ContractRangeCountries";
import ContractRangeDerivative from "@/app/[locale]/webtoons/[webtoonId]/ContractRangeDerivative";

const typeMap = {
  "all": "전체",
  "webtoon": "웹툰",
  "movie": "영화",
  "drama": "드라마",
  "webDrama": "웹드라마",
  "ads": "광고",
  "musical": "뮤지컬",
  "game": "게임",
  "book": "도서",
  "product": "상품"
};


export default async function ContractRange({ webtoon }: {
  webtoon: WebtoonExtendedT
}) {

  const t = await getTranslations("contractRangeData");
  const tGeneral = await getTranslations("general");

  const { bidRound } = webtoon;
  if(!bidRound) {
    return <>
      {/*TODO*/}
      등록된 판매 정보가 없습니다.
    </>;
  }

  return (
    <Col>
      <h1 className="text-2xl font-bold">{t("detailedInformation")}</h1>
      {
        webtoon.isMine && <Link
          className="bg-mint ml-4"
          href={`/market/bid-rounds/${webtoon.id}/update`}
        >
          {tGeneral("edit")}
        </Link>
      }
      <ContractRangeBasic bidRound={bidRound}/>
      <div className="flex justify-between gap-20">
        <ContractRangeCountries bidRound={bidRound}/>
        <ContractRangeDerivative bidRound={bidRound}/>
      </div>
    </Col>
  );
}
