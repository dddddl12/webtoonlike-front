import { Col, Gap, Row } from "@/ui/layouts";
import { WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import { Link } from "@/i18n/routing";
import ContractRangeBasic from "@/app/[locale]/webtoons/[webtoonId]/ContractRangeBasic";
import React from "react";
import { getTranslations } from "next-intl/server";
import ContractRangeCountries from "@/app/[locale]/webtoons/[webtoonId]/ContractRangeCountries";
import ContractRangeDerivative from "@/app/[locale]/webtoons/[webtoonId]/ContractRangeDerivative";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Text } from "@/ui/texts";

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
      <Row>
        <h1 className="text-2xl font-bold">{t("detailedInformation")}</h1>
        {
          webtoon.isEditable && <Link
            className="ml-4 flex items-center gap-2 text-mint"
            href={`/market/bid-rounds/${webtoon.id}/update`}
          >
            <Pencil1Icon width={25} height={25} />
            <Text>{tGeneral("edit")}</Text>
          </Link>
        }
      </Row>
      <ContractRangeBasic bidRound={bidRound}/>
      <div className="flex justify-between gap-20">
        <ContractRangeCountries bidRound={bidRound}/>
        <ContractRangeDerivative bidRound={bidRound}/>
      </div>
    </Col>
  );
}
