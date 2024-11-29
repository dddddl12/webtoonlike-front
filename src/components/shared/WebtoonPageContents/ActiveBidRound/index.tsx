import { Col, Row } from "@/components/ui/common";
import ActiveBidRoundBasic from "@/components/shared/WebtoonPageContents/ActiveBidRound/ActiveBidRoundBasic";
import React from "react";
import ContractRangeCountries from "@/components/shared/WebtoonPageContents/ActiveBidRound/ContractRangeCountries";
import ContractRangeDerivative from "@/components/shared/WebtoonPageContents/ActiveBidRound/ContractRangeDerivative";
import { useTranslations } from "next-intl";
import EditLink from "@/components/ui/EditLink";
import { WebtoonDetailsExtendedT } from "@/resources/webtoons/dtos/webtoonDetails.dto";

export default function ActiveBidRound({ webtoon }: {
  webtoon: WebtoonDetailsExtendedT;
}) {

  const t = useTranslations("bidRoundDetails");

  return (
    <Col className="w-full gap-14">
      <Row>
        <h1 className="text-2xl font-bold">{t("detailedInformation")}</h1>
        <EditLink
          className="ml-4"
          href={!webtoon.activeBidRound
            ? `/webtoons/${webtoon.id}/bid-round/create`
            : `/webtoons/${webtoon.id}/bid-round/update`}
          isVisible={webtoon.isEditable}
          isNew={!webtoon.activeBidRound}
        />
      </Row>
      <ActiveBidRoundContent bidRound={webtoon.activeBidRound}/>
    </Col>
  );
}

function ActiveBidRoundContent({ bidRound }: {
  bidRound?: WebtoonDetailsExtendedT["activeBidRound"];
}) {
  if (!bidRound) {
    return <>
      {/*TODO*/}
      등록된 판매 정보가 없습니다.
    </>;
  }
  return <>
    <ActiveBidRoundBasic bidRound={bidRound}/>
    <div className="flex justify-between gap-20">
      <ContractRangeCountries bidRound={bidRound}/>
      <ContractRangeDerivative bidRound={bidRound}/>
    </div>
  </>;
}
