import { Col, Gap } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { useMemo } from "react";
import { useAlertDialog } from "@/hooks/ConfirmDialog";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { WebtoonT } from "@/resources/webtoons/webtoon.types";
import WebtoonDetailsLikeButton from "@/app/[locale]/webtoons/[webtoonId]/WebtoonDetailsLikeButton";
import { UserTypeT } from "@/resources/users/user.types";
import { BidRoundStatus, BidRoundT } from "@/resources/bidRounds/bidRound.types";
import { useUserMetadata } from "@/hooks/userMetadata";

export default function WebtoonDetailsBtns({ webtoon }: {
  webtoon: WebtoonT;
}) {
  const locale = useLocale();
  const { bidRounds } = webtoon;
  const latestBidRound = useMemo(() => {
    if (!bidRounds) return;
    const sortedBidRounds = bidRounds.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sortedBidRounds[0];
  }, [webtoon.bidRounds]);

  const isDone = latestBidRound?.status === BidRoundStatus.Done;

  const { user } = useUserMetadata();
  const isOwner = user?.type === UserTypeT.Creator
    && webtoon.authorId === user.creatorId;
  // TODO creator로 변경
  const isDisapproved = !!latestBidRound?.disapprovedAt;

  return (
    <Col className="sm:flex-row">
      <WebtoonDetailsLikeButton initWebtoonLike={{
        webtoonId: webtoon.id,
        likes: webtoon.likes,
        myLike: webtoon.myLike!, //TODO 타입 세분화 후 느낌표 삭제
      }} />
      <Gap x={10} />
      <Gap y={2} />

      {user?.type === UserTypeT.Buyer
        && <OfferButton
          latestBidRound={latestBidRound}
        />}
      {isOwner
        && ((!latestBidRound || isDone)
          ? <SubmitButton webtoon={webtoon}/>
          : <StatusButton
            isDisapproved={isDisapproved}
            latestBidRound={latestBidRound}
            webtoon={webtoon}
          />
        )}
    </Col>
  );
}

function OfferButton ({ latestBidRound }: {
  latestBidRound?: BidRoundT;
}) {
  const TofferPage = useTranslations("offerPage");

  const isPossibleToOffer = latestBidRound
    && [BidRoundStatus.Bidding, BidRoundStatus.Negotiating]
      .includes(latestBidRound.status);
  if (isPossibleToOffer) {
    return <Link
      className="w-full bg-red text-white rounded-sm hover:text-texts h-10 flex justify-center items-center cursor-pointer"
      href={`/buyer/bid-rounds/${latestBidRound?.id}/request`}
    >
      {TofferPage("makeOffer")}
    </Link>;
  }
  return (
    <Button
      disabled
      className="w-full bg-red text-white rounded-sm hover:text-texts h-10 flex justify-center items-center"
    >
      {latestBidRound
        ? TofferPage("notPossibleToOffer")
        : TofferPage("unableToMakeOffer")
      }
    </Button>
  );
}


function SubmitButton({ webtoon }: {
  webtoon: WebtoonT
}) {
  const { showAlertDialog } = useAlertDialog();
  const TseriesManagement = useTranslations("seriesManagement");
  const Terror = useTranslations("errorPopup");

  return (
    webtoon.episodes && webtoon.episodes?.length < 3 ?
      <Button onClick={async() => {
        const isOk = await showAlertDialog({
          title: `${Terror("headingError")}`,
          body: `${Terror("subheaderError")}`,
          useOk: true,
        });
        if(!isOk) {
          return;
        }
      }} className="w-full bg-mint text-white rounded-sm hover:text-texts h-10 flex justify-center items-center">{TseriesManagement("registerOfContentTransactions")}</Button>
      : webtoon.bidRounds && webtoon.bidRounds.length > 0 ? null :
        <Link
          className="w-full bg-mint text-white rounded-sm hover:text-texts h-10 flex justify-center items-center cursor-pointer"
          href={`/market/bid-rounds/${webtoon.id}/create`}
        >
          {TseriesManagement("registerOfContentTransactions")}
        </Link>
  );
}

function StatusButton({ isDisapproved, latestBidRound, webtoon }: {
  isDisapproved:boolean;
  latestBidRound: BidRoundT;
  webtoon: WebtoonT;
}) {
  const { showAlertDialog } = useAlertDialog();
  const Terror = useTranslations("errorPopup");
  const TbidRoundStatus = useTranslations("bidRoundStatus");
  const TseriesManagement = useTranslations("seriesManagement");

  if (!isDisapproved) {
    return (
      <Button
        disabled
        className="w-full bg-mint text-white rounded-sm hover:text-texts h-10 flex justify-center items-center"
      >
        {TbidRoundStatus(latestBidRound.status)}
      </Button>
    );
  }

  return (
    webtoon.episodes && webtoon.episodes?.length < 3 ?
      <Button onClick={async() => {
        const isOk = await showAlertDialog({
          title: `${Terror("headingError")}`,
          body: `${Terror("subheaderError")}`,
          useOk: true,
        });
        if(!isOk) {
          return;
        }
      }} className="w-full bg-mint text-white rounded-sm hover:text-texts h-10 flex justify-center items-center">{TseriesManagement("reregisterOfContentTransactions")}</Button>
      :
      <Link
        className="w-full bg-mint text-white rounded-sm hover:text-texts h-10 flex justify-center items-center cursor-pointer"
        href={`/market/bid-rounds/${webtoon.id}/update`}
      >
        {TseriesManagement("reregisterOfContentTransactions")}
      </Link>
  );
};

