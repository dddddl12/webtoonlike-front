import { Row } from "@/components/ui/common";
import { Link } from "@/i18n/routing";
import { BidRoundStatus } from "@/resources/bidRounds/dtos/bidRound.dto";
import { Button } from "@/shadcn/ui/button";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { WebtoonDetailsExtendedT } from "@/resources/webtoons/dtos/webtoonDetails.dto";
import { useContext } from "react";
import OpenOfferFormContext from "@/components/shared/WebtoonPageContents/OpenOfferFormContext";

export default function WebtoonDetailsButtons({ webtoon, className }: {
  webtoon: WebtoonDetailsExtendedT;
  className?: string;
}) {
  return <Row className={clsx(className, "gap-4 w-full")}>
    <ViewButton webtoon={webtoon} />
    {webtoon.isEditable
      && <AddEpisodeButton webtoon={webtoon}/>}
    {webtoon.hasRightToOffer
    && <OfferButton webtoon={webtoon} />}
  </Row>;
}

function ViewButton ({ webtoon }: {
  webtoon: WebtoonDetailsExtendedT;
}) {
  const t = useTranslations("webtoonDetails");
  return <Button variant="darkGray" className="flex-1" size="lg"
    disabled={!webtoon.firstEpisodeId} asChild>
    <Link href={`/webtoons/${webtoon.id}/episodes/${webtoon.firstEpisodeId}`}>
      {webtoon.firstEpisodeId ? t("viewEpisodes") : t("unableToView")}
    </Link>
  </Button>;
}

function AddEpisodeButton ({ webtoon }: {
  webtoon: WebtoonDetailsExtendedT;
}) {
  return <Button variant="mint" className="flex-1" size="lg" asChild>
    <Link href={`/webtoons/${webtoon.id}/episodes/create`}>
      에피소드 추가
    </Link>
  </Button>;
}

function OfferButton ({ webtoon }: {
  webtoon: WebtoonDetailsExtendedT;
}) {
  const { activeBidRound } = webtoon;
  const t = useTranslations("webtoonDetails");
  const openOfferForm = useContext(OpenOfferFormContext);

  const isPossibleToOffer = activeBidRound
    && [BidRoundStatus.Bidding, BidRoundStatus.Negotiating]
      .includes(activeBidRound.status);
  return <Button
    variant="mint"
    className="flex-1"
    size="lg"
    disabled={!isPossibleToOffer}
    onClick={openOfferForm}
  >
    {isPossibleToOffer
      ? t("makeOffer")
      : (activeBidRound
        ? t("notPossibleToOffer")
        : t("unableToMakeOffer"))}
  </Button>;
}
