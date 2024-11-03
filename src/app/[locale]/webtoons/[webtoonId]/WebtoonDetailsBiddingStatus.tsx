"use client";

import { Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { useTranslations } from "next-intl";
import { BidRoundExtendedT } from "@/resources/bidRounds/bidRound.types";
import { IconPerson } from "@/components/svgs/IconPerson";
import { useBiddingTime } from "@/hooks/biddingTime";
import { IconTimer } from "@/components/svgs/IconTimer";

export default function WebtoonDetailsBiddingStatus({ bidRound }: {
  bidRound?: BidRoundExtendedT
} ) {
  const timeLeft = useBiddingTime(bidRound?.bidStartsAt, bidRound?.negoStartsAt);
  const t = useTranslations("webtoonDetails");

  if (!bidRound || !timeLeft) {
    return null;
  }

  return (
    <Row className="bg-gray justify-around w-[110px] h-[40px] px-[12px] py-p[8px] rounded-[20px] mb-10">
      <IconTimer fill="#808080"/>
      <Text className="text-[12px] text-black">
        {t("timeLeft", timeLeft)}
      </Text>
      <Text className="text-[18px] text-gray-shade">|</Text>

      <IconPerson fill="#808080"/>
      <Text className="text-[12px] text-black">
        {t("numberOfOffers", {
          count: bidRound.bidRequestCount
        })}
      </Text>
    </Row>
  );
}
