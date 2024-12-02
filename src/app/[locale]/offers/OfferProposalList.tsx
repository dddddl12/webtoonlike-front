import { useLocale, useTranslations } from "next-intl";
import {
  listOfferProposals
} from "@/resources/offers/controllers/offerProposal.controller";
import { useEffect, useMemo, useRef, useState } from "react";
import useTokenInfo from "@/hooks/tokenInfo";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { OfferProposalListT } from "@/resources/offers/dtos/offerProposal.dto";
import ViewOfferProposalSection from "@/app/[locale]/offers/components/ViewOfferProposalSection";
import { ProposalsReloadReq } from "@/app/[locale]/offers/OfferDetailsContext";
import useSafeAction from "@/hooks/safeAction";
import { ListCell, ListRow, ListTable, useListExpansionSwitch } from "@/components/ui/ListTable";

// TODO 페이지네이션 없음
export default function OfferProposalList({ offerId, reloadReq }: {
  offerId: number;
  reloadReq?: ProposalsReloadReq;
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const [offerProposalsResponse, setOfferProposalsResponse] = useState<OfferProposalListT>();

  const boundSetOfferProposalsResponse = useMemo(() => listOfferProposals.bind(null, offerId), [offerId]);
  const { execute } = useSafeAction(boundSetOfferProposalsResponse, {
    onSuccess: ({ data }) => {
      setOfferProposalsResponse(data);
      if (reloadReq?.refocusToLast) {
        // 접기 등 상태 재조정
        setReloadKey(prev => prev + 1);
      }
    }
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const t = useTranslations("proposalList");

  if (!offerProposalsResponse) {
    return <div>
      <Skeleton className="w-full h-[40px] my-[20px]" />
      <Skeleton className="w-full h-[40px] my-[20px]" />
    </div>;
  }

  const { proposals, invoice } = offerProposalsResponse;

  return <ListTable key={reloadKey} columns={[
    {
      label: "No.",
      width: 1
    },
    {
      label: t("date"),
      width: 3
    },
    {
      label: t("sender.label"),
      width: 3
    },
    {
      label: t("proposal"),
      width: 1.5
    },
    {
      label: t("status.label"),
      width: 1.5
    }
  ]}>
    {proposals.map((proposal, index) => (
      <ProposalRow
        key={index}
        seq={index}
        user={proposal.user}
        createdAt={proposal.createdAt}
        statusLabel={index === 0
          ? t("status.proposed") : t("status.adjustmentRequested")}
        offerProposal={proposal}
        defaultOpen={reloadReq?.refocusToLast && index === proposals.length - 1}
      />
    ))}
    {!!invoice
    && <ProposalRow
      seq={proposals.length}
      user={{
        id: -1,
        name: t("sender.admin")
      }}
      createdAt={invoice.createdAt}
      statusLabel={t("status.invoiced")}>
    </ProposalRow>}
  </ListTable>;
}

function ProposalRow({ seq, createdAt, user, statusLabel, defaultOpen, offerProposal }: {
  seq: number;
  createdAt: Date;
  user: {
    id: number;
    name: string;
  };
  statusLabel: string;
  defaultOpen?: boolean;
  offerProposal?: OfferProposalListT["proposals"][number];
}) {
  const locale = useLocale();
  const { tokenInfo } = useTokenInfo();

  const lastProposalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (defaultOpen) {
      lastProposalRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [defaultOpen]);

  const t = useTranslations("proposalList");
  const { switchButton, ListRowExpanded } = useListExpansionSwitch();
  return <>
    <ListRow ref={lastProposalRef}>
      <ListCell>
        {seq + 1}
      </ListCell>
      <ListCell>
        {createdAt.toLocaleString(locale)}
      </ListCell>
      <ListCell>
        {tokenInfo?.userId === user.id ? t("sender.me") : user.name}
      </ListCell>
      <ListCell>
        {offerProposal && switchButton}
      </ListCell>
      <ListCell>{statusLabel}</ListCell>
    </ListRow>
    {offerProposal && <ListRowExpanded>
      <ViewOfferProposalSection offerProposalId={offerProposal.id}/>
    </ListRowExpanded>}
  </>;
}
