"use client";

import { Col, Gap } from "@/ui/layouts";
import { WebtoonDetailLikeButton } from "../WebtoonDetailLikeButton";
import { Button } from "@/ui/shadcn/Button";
import { WebtoonT } from "@/types";
import { useMe } from "@/states/UserState";
import { useMemo } from "react";
import { convertBidRoundStatus, convertBidRoundStatusEn } from "@/utils/bidRoundStatusConverter";
import { useAlertDialog } from "@/hooks/ConfirmDialog";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

type WebtoonDetailBtnsProps = {
  webtoon: WebtoonT;
}

export function WebtoonDetailBtns({ webtoon }: WebtoonDetailBtnsProps) {
  const router = useRouter();
  const me = useMe();
  const locale = useLocale();
  const { showAlertDialog } = useAlertDialog();
  const { bidRounds } = webtoon;
  const latestBidRound = useMemo(() => {
    if (!bidRounds) return;
    const sortedBidRounds = bidRounds.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sortedBidRounds[0];
  }, [webtoon.bidRounds]);

  const isBuyer = me?.userType === "buyer";
  const isCreator = me?.userType === "creator";
  const isBidRoundEmpty = !webtoon.bidRounds?.length;
  const isDone = latestBidRound?.status === "done";
  const isOwner = webtoon.authorId === me?.id && isCreator;
  const isDisapproved = latestBidRound?.disapprovedAt;
  const TofferPage = useTranslations("offerPage");
  const TseriesManagement = useTranslations("seriesManagement");
  const Terror = useTranslations("errorPopup");

  const submitButton = () => {
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
        <div
          className="w-full bg-mint text-white rounded-sm hover:text-texts h-10 flex justify-center items-center cursor-pointer"
          onClick={() => {router.push(`/market/bid-rounds/${webtoon.id}/create`);}}>
          {TseriesManagement("registerOfContentTransactions")}
        </div>
    );
  };

  const resubmitButton = () => {
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
        <div
          className="w-full bg-mint text-white rounded-sm hover:text-texts h-10 flex justify-center items-center cursor-pointer"
          onClick={() => {router.push(`/market/bid-rounds/${webtoon.id}/update`);}}>
          {TseriesManagement("reregisterOfContentTransactions")}
        </div>
    );
  };

  const isPossibleToOffer = () => {
    if (latestBidRound?.status === "idle" || latestBidRound?.status === "waiting" || latestBidRound?.status === "done") {
      return false;
    } else if (latestBidRound?.status === "bidding" || latestBidRound?.status === "negotiating") {
      return true;
    }
  };

  const renderOfferButton = () => {
    if (isBuyer && !isBidRoundEmpty) {
      return (
        isPossibleToOffer() ?
          <div
            className="w-full bg-red text-white rounded-sm hover:text-texts h-10 flex justify-center items-center cursor-pointer"
            onClick={() => {router.push(`/buyer/bid-rounds/${latestBidRound?.id}/request`);}}>
            {TofferPage("makeOffer")}
          </div>
          :
          <Button
            disabled
            className="w-full bg-red text-white rounded-sm hover:text-texts h-10 flex justify-center items-center"
          >
            {TofferPage("notPossibleToOffer")}
          </Button>


      );
    }
    if (isBuyer && isBidRoundEmpty) {
      return (
        <Button
          disabled
          className="w-full bg-red text-white rounded-sm hover:text-texts h-10 flex justify-center items-center"
        >
          {TofferPage("unableToMakeOffer")}
        </Button>
      );
    }
    return null;
  };

  const renderSubmitButton = () => {
    if (isOwner && isBidRoundEmpty) {
      return (
        submitButton()
      );
    }
    if (isOwner && !isBidRoundEmpty && isDone) {
      return (
        submitButton()
      );
    }
    return null;
  };

  const renderStatusButton = () => {
    if (isOwner && !isBidRoundEmpty && !isDone && !isDisapproved) {
      return (
        <Button
          disabled
          className="w-full bg-mint text-white rounded-sm hover:text-texts h-10 flex justify-center items-center"
        >
          {locale === "ko" ? convertBidRoundStatus(latestBidRound?.status) : convertBidRoundStatusEn(latestBidRound?.status)}
        </Button>
      );
    }
    if (isOwner && !isBidRoundEmpty && !isDone && isDisapproved) {
      return (
        resubmitButton()
      );
    }
    return null;
  };

  return (
    <Col className="sm:flex-row">
      <WebtoonDetailLikeButton webtoon={webtoon} />
      <Gap x={10} />
      <Gap y={2} />

      {renderOfferButton()}
      {renderSubmitButton()}
      {renderStatusButton()}
    </Col>
  );
}
