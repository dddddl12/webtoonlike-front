"use client";

import { useToast } from "@/shadcn/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import useSafeActionForm from "@/hooks/safeActionForm";
import { OfferProposalFormSchema } from "@/resources/offers/dtos/offerProposal.dto";
import { createOfferProposal } from "@/resources/offers/controllers/offerProposal.controller";
import FormWrapper from "@/components/forms/offer/FormWrapper";
import ReloadOfferContext from "@/app/[locale]/offers/ReloadOfferContext";
import { useContext } from "react";

export default function OfferProposalForm({ offerId, refOfferProposalId }: {
  offerId: number;
  refOfferProposalId: number;
}) {
  const { toast } = useToast();
  const reload = useContext(ReloadOfferContext);
  const safeActionFormReturn = useSafeActionForm(
    createOfferProposal.bind(null, offerId, refOfferProposalId),
    {
      resolver: zodResolver(OfferProposalFormSchema),
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          toast({
            description: "수정 제안을 보냈습니다."
          });
          reload();
        }
      }
    });
  return <FormWrapper {...safeActionFormReturn}/>;
}
