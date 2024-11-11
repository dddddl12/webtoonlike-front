import { WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import { Row } from "@/shadcn/ui/layouts";
import { Link } from "@/i18n/routing";
import { BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { Button } from "@/shadcn/ui/button";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";

export default function WebtoonDetailsButtons({ webtoon, setOpenBidRequestForm }: {
  webtoon: WebtoonExtendedT;
  setOpenBidRequestForm: Dispatch<SetStateAction<boolean>>;
}) {
  return <Row className="gap-4 w-full">
    <ViewButton webtoon={webtoon} />
    {webtoon.isEditable
      ? <BidRoundButton webtoon={webtoon}/>
      : <OfferButton webtoon={webtoon} setOpenBidRequestForm={setOpenBidRequestForm}/>}
  </Row>;
}

function ViewButton ({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const t = useTranslations("webtoonDetails");
  return <ControlButton className="bg-[#C3C3C3] text-black"
    disabled={!webtoon.firstEpisodeId}>
    <Link href={`/webtoons/${webtoon.id}/episodes/${webtoon.firstEpisodeId}`}>
      {webtoon.firstEpisodeId ? t("viewEpisodes") : t("unableToView")}
    </Link>
  </ControlButton>;
}

function BidRoundButton ({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const t = useTranslations("seriesManagement");
  if (webtoon.activeBidRound) {
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

function OfferButton ({ webtoon, setOpenBidRequestForm }: {
  webtoon: WebtoonExtendedT;
  setOpenBidRequestForm: Dispatch<SetStateAction<boolean>>;
}) {
  const { activeBidRound } = webtoon;
  const t = useTranslations("webtoonDetails");

  const isPossibleToOffer = activeBidRound
    && [BidRoundStatus.Bidding, BidRoundStatus.Negotiating]
      .includes(activeBidRound.status);
  // TODO 시간으로 변경
  return <ControlButton
    className="bg-mint text-white"
    disabled={!isPossibleToOffer}
    onClick={() => setOpenBidRequestForm(true)}
  >
    {isPossibleToOffer
      ? t("makeOffer")
      : (activeBidRound
        ? t("notPossibleToOffer")
        : t("unableToMakeOffer"))}
  </ControlButton>;
}

function ControlButton({ children, className, disabled, onClick }: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return <Button
    onClick={onClick}
    disabled={disabled}
    className={clsx("rounded-sm h-12 flex justify-center items-center flex-1 font-bold text-base", className)}
  >
    {children}
  </Button>;
}
