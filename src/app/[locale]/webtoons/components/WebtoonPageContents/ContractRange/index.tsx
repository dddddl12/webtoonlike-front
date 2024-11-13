import { Col, Row } from "@/shadcn/ui/layouts";
import { WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import { Link } from "@/i18n/routing";
import ContractRangeBasic from "@/app/[locale]/webtoons/components/WebtoonPageContents/ContractRange/ContractRangeBasic";
import React from "react";
import ContractRangeCountries from "@/app/[locale]/webtoons/components/WebtoonPageContents/ContractRange/ContractRangeCountries";
import ContractRangeDerivative from "@/app/[locale]/webtoons/components/WebtoonPageContents/ContractRange/ContractRangeDerivative";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Text } from "@/shadcn/ui/texts";
import { useTranslations } from "next-intl";

export default function ContractRange({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {

  const t = useTranslations("contractRangeData");
  const tGeneral = useTranslations("general");

  const { activeBidRound } = webtoon;
  if (!activeBidRound) {
    return <>
      {/*TODO*/}
      등록된 판매 정보가 없습니다.
    </>;
  }

  return (
    <Col className="w-full gap-14">
      <Row>
        <h1 className="text-2xl font-bold">{t("detailedInformation")}</h1>
        {
          webtoon.isEditable && <Link
            className="ml-4 flex items-center gap-2 text-mint"
            href={`/webtoons/${webtoon.id}/bid-round/update`}
          >
            <Pencil1Icon width={25} height={25} />
            <Text>{tGeneral("edit")}</Text>
          </Link>
        }
      </Row>
      <ContractRangeBasic bidRound={activeBidRound}/>
      <div className="flex justify-between gap-20">
        <ContractRangeCountries bidRound={activeBidRound}/>
        <ContractRangeDerivative bidRound={activeBidRound}/>
      </div>
    </Col>
  );
}
