import { Col, Row } from "@/shadcn/ui/layouts";
import { Link } from "@/i18n/routing";
import ActiveBidRoundBasic from "@/app/[locale]/webtoons/components/WebtoonPageContents/ActiveBidRound/ActiveBidRoundBasic";
import React from "react";
import ContractRangeCountries from "@/app/[locale]/webtoons/components/WebtoonPageContents/ActiveBidRound/ContractRangeCountries";
import ContractRangeDerivative from "@/app/[locale]/webtoons/components/WebtoonPageContents/ActiveBidRound/ContractRangeDerivative";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Text } from "@/shadcn/ui/texts";
import { useTranslations } from "next-intl";
import { WebtoonDetailsT } from "@/resources/webtoons/webtoon.service";

export default function ActiveBidRound({ webtoon }: {
  webtoon: WebtoonDetailsT;
}) {

  const t = useTranslations("bidRoundDetails");
  const tGeneral = useTranslations("general");

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
      <ActiveBidRoundContent bidRound={webtoon.activeBidRound}/>
    </Col>
  );
}

function ActiveBidRoundContent({ bidRound }: {
  bidRound?: WebtoonDetailsT["activeBidRound"];
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
