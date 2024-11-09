import { WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import { Row } from "@/shadcn/ui/layouts";
import { Link } from "@/i18n/routing";
import { BidRoundStatus, BidRoundT } from "@/resources/bidRounds/bidRound.types";
import { Button } from "@/shadcn/ui/button";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { getTranslations } from "next-intl/server";

export default async function WebtoonDetailsButtons({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  return <Row className="gap-4 w-full">
    <ViewButton webtoon={webtoon} />
    {webtoon.isEditable
      ? <BidRoundButton webtoon={webtoon}/>
      : <OfferButton webtoon={webtoon}/>}
  </Row>;
}

async function ViewButton ({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const t = await getTranslations("webtoonDetails");
  return <ControlButton className="bg-[#C3C3C3] text-black"
    disabled={!webtoon.firstEpisodeId}>
    <Link href={`/webtoons/${webtoon.id}/episodes/${webtoon.firstEpisodeId}`}>
      {webtoon.firstEpisodeId ? t("viewEpisodes") : t("unableToView")}
    </Link>
  </ControlButton>;
}

async function BidRoundButton ({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const t = await getTranslations("seriesManagement");
  if(webtoon.bidRound) {
    return <ControlButton className="bg-mint text-white">
      <Link href={`/webtoons/${webtoon.id}/bid-round/update`}>
        {t("reregisterOfContentTransactions")}
      </Link>
    </ControlButton>;
  } else {
    return <ControlButton className="bg-mint text-white">
      <Link href={`/webtoons/${webtoon.id}/bid-round/create`}>
        {t("registerOfContentTransactions")}
      </Link>
    </ControlButton>;
  }
}

async function OfferButton ({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const { bidRound } = webtoon;
  const t = await getTranslations("webtoonDetails");

  const isPossibleToOffer = bidRound
    && [BidRoundStatus.Bidding, BidRoundStatus.Negotiating]
      .includes(bidRound.status);
  // TODO 시간으로 변경
  return <ControlButton
    className="bg-mint text-white"
    disabled={!isPossibleToOffer}
  >
    <Link href={`/offers/${webtoon.id}/create`}>
      {isPossibleToOffer
        ? t("makeOffer")
        : (bidRound
          ? t("notPossibleToOffer")
          : t("unableToMakeOffer"))}
    </Link>
  </ControlButton>;
}

function ControlButton({ children, className, disabled }: {
  children: ReactNode;
  className?: string;
  disabled?: boolean
}) {
  return <Button
    disabled={disabled}
    className={clsx("rounded-sm h-12 flex justify-center items-center flex-1 font-bold text-base", className)}
  >
    {children}
  </Button>;
}
