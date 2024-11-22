import { Row } from "@/shadcn/ui/layouts";
import { Link } from "@/i18n/routing";
import { BidRoundStatus } from "@/resources/bidRounds/bidRound.types";
import { Button } from "@/shadcn/ui/button";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { WebtoonDetailsT } from "@/resources/webtoons/webtoon.controller";

export default function WebtoonDetailsButtons({ webtoon, setOpenBidRequestForm }: {
  webtoon: WebtoonDetailsT;
  setOpenBidRequestForm: Dispatch<SetStateAction<boolean>>;
}) {
  return <Row className="gap-4 w-full">
    <ViewButton webtoon={webtoon} />
    {webtoon.isEditable
      && <AddEpisodeButton webtoon={webtoon}/>}
    {webtoon.hasRightToOffer
    && <OfferButton webtoon={webtoon} setOpenBidRequestForm={setOpenBidRequestForm}/>}
  </Row>;
}

function ViewButton ({ webtoon }: {
  webtoon: WebtoonDetailsT;
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
  webtoon: WebtoonDetailsT;
}) {
  return <Button variant="mint" className="flex-1" size="lg" asChild>
    <Link href={`/webtoons/${webtoon.id}/episodes/create`}>
      에피소드 추가
    </Link>
  </Button>;
}

function OfferButton ({ webtoon, setOpenBidRequestForm }: {
  webtoon: WebtoonDetailsT;
  setOpenBidRequestForm: Dispatch<SetStateAction<boolean>>;
}) {
  const { activeBidRound } = webtoon;
  const t = useTranslations("webtoonDetails");

  const isPossibleToOffer = activeBidRound
    && [BidRoundStatus.Bidding, BidRoundStatus.Negotiating]
      .includes(activeBidRound.status);
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
