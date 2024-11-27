import { Row } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import {
  changeOfferProposalStatus,
} from "@/resources/offers/controllers/offerProposal.controller";
import { useContext, useMemo, useState } from "react";
import { useToast } from "@/shadcn/hooks/use-toast";
import useSafeAction from "@/hooks/safeAction";
import { useTranslations } from "next-intl";
import { useConfirm } from "@/hooks/alert";
import { OfferProposalDetailsT, OfferProposalStatus } from "@/resources/offers/dtos/offerProposal.dto";
import OfferProposalForm from "@/components/forms/offer/OfferProposalForm";
import ReloadOfferContext from "@/app/[locale]/offers/ReloadOfferContext";

export default function Controls({ offerProposal }: {
  offerProposal: OfferProposalDetailsT;
}) {
  const { toast } = useToast();
  const t = useTranslations("offerControls");
  const boundChangeOfferProposalStatus = useMemo(() => changeOfferProposalStatus
    .bind(null, offerProposal.id), [offerProposal.id]);
  const reload = useContext(ReloadOfferContext);
  const { execute } = useSafeAction(boundChangeOfferProposalStatus, {
    onSuccess: ({ input }) => {
      if (!input) {
        throw new Error("data is null");
      }
      toast({
        description: input.changeTo === OfferProposalStatus.Accepted
          ? t("accept.toast")
          : t("decline.toast")
      });
      reload();
    },
    onError: () => {
      // executeOnFailure();
    }
  });

  const declineConfirm = useConfirm({
    title: t("decline.alertTitle"),
    message: t("decline.alertMessage"),
    confirmText: t("decline.confirm"),
    onConfirm: () => execute({
      changeTo: OfferProposalStatus.Declined
    })
  });

  const acceptConfirm = useConfirm({
    title: t("accept.alertTitle"),
    message: t("accept.alertMessage"),
    confirmText: t("accept.confirm"),
    onConfirm: () => execute({
      changeTo: OfferProposalStatus.Accepted
    })
  });

  // 오퍼 실패 시 업데이트
  // const boundGetSimpleBidRequest = useMemo(() => getOfferWithMetaDataSchema
  //   .bind(null, bidRequestId), [bidRequestId]);
  // const { execute: executeOnFailure } = useSafeAction(boundGetSimpleBidRequest, {
  //   onSuccess: ({ data }) => {
  //     if (!data) {
  //       throw new Error("data is null");
  //     }
  //     setCurBidRequest(data);
  //   }
  // });

  const [showForm, setShowForm] = useState<boolean>(false);

  return <>
    <Row className="gap-20 mx-auto mt-14 mb-10" >
      <Button variant="red" onClick={declineConfirm.open}>
        {t("decline.actionButton")}
      </Button>
      <Button variant="gray" onClick={() =>
        setShowForm(prev => !prev)}>
        {t("message.actionButton")}
      </Button>
      <Button variant="mint" onClick={acceptConfirm.open}>
        {t("accept.actionButton")}
      </Button>
    </Row>
    {showForm && <OfferProposalForm
      offerId={offerProposal.offerId}
      refOfferProposalId={offerProposal.id}/>}
  </>;
}
