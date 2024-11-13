import { WebtoonExtendedT } from "@/resources/webtoons/webtoon.types";
import { Row } from "@/shadcn/ui/layouts";
import { Link } from "@/i18n/routing";
import { BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { Button } from "@/shadcn/ui/button";
import { Dispatch, SetStateAction } from "react";
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
  return <Button variant="darkGray" className="flex-1" size="lg"
    disabled={!webtoon.firstEpisodeId} asChild>
    <Link href={`/webtoons/${webtoon.id}/episodes/${webtoon.firstEpisodeId}`}>
      {webtoon.firstEpisodeId ? t("viewEpisodes") : t("unableToView")}
    </Link>
  </Button>;
}

function BidRoundButton ({ webtoon }: {
  webtoon: WebtoonExtendedT;
}) {
  const t = useTranslations("seriesManagement");
  if (webtoon.activeBidRound) {
    return <Button variant="mint" className="flex-1" size="lg" asChild>
      <Link href={`/webtoons/${webtoon.id}/bid-round/update`}>
        {t("reregisterOfContentTransactions")}
      </Link>
    </Button>;
  } else {
    return <Button variant="mint" className="flex-1" size="lg" asChild>
      <Link href={`/webtoons/${webtoon.id}/bid-round/create`}>
        {t("registerOfContentTransactions")}
      </Link>
    </Button>;
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
  return <Button
    variant="mint"
    className="flex-1"
    size="lg"
    disabled={!isPossibleToOffer}
    onClick={() => setOpenBidRequestForm(true)}
  >
    {isPossibleToOffer
      ? t("makeOffer")
      : (activeBidRound
        ? t("notPossibleToOffer")
        : t("unableToMakeOffer"))}
  </Button>;
}
