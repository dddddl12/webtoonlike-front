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
import OfferDetailsContext from "@/app/[locale]/offers/OfferDetailsContext";

export default function Controls({ offerProposal }: {
  offerProposal: OfferProposalDetailsT;
}) {
  const { toast } = useToast();
  const t = useTranslations("offerControls");
  const boundChangeOfferProposalStatus = useMemo(() => changeOfferProposalStatus
    .bind(null, offerProposal.id), [offerProposal.id]);
  const { changeStatus, reloadProposals } = useContext(OfferDetailsContext);
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
      changeStatus(input.changeTo);
      // todo
      reloadProposals({
        refocusToLast: true
      });
    },
    onError: () => {
      reloadProposals({
        refocusToLast: false
      });
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
