"use client";

import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import { ListResponse } from "@/resources/globalTypes";
import OfferDetailsForInvoice from "@/app/[locale]/invoices/OfferDetailsForInvoice";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";
import { Link } from "@/i18n/routing";
import { listUninvoicedOffers } from "@/resources/invoices/controllers/invoice.controller";
import { UninvoicedOfferT } from "@/resources/invoices/dtos/invoice.dto";
import { ListCell, ListRow, ListTable, useListExpansionSwitch } from "@/components/ui/ListTable";

export function UninvoicedOfferList({ initialUninvoicedListResponse }: {
  initialUninvoicedListResponse: ListResponse<UninvoicedOfferT>;
}) {
  const t = useTranslations("invoiceManagement");
  const { listResponse, filters, setFilters } = useListData(
    listUninvoicedOffers,
    { page: 1 },
    initialUninvoicedListResponse
  );

  if (listResponse.items.length === 0) {
    return <NoItems message={t("noUnvoiced")}/>;
  }

  // todo 오퍼 중 계약이 종료되면?

  return <>
    <ListTable columns={[
      {
        label: t("seriesName"),
        width: 1
      },
      {
        label: t("authorName"),
        width: 1
      },
      {
        label: t("buyerName"),
        width: 1
      },
      {
        label: "협상 개요",
        width: 1
      },
      {
        label: "신청 일자",
        width: 1
      },
      {
        label: t("downloadInvoice"),
        width: 1
      }
    ]}>
      {listResponse.items.map((offer, i) => (
        <TableRow key={i} offer={offer} />
      ))}
    </ListTable>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}

function TableRow({ offer }: { offer: UninvoicedOfferT }) {
  const locale = useLocale();
  const { switchButton, ListRowExpanded } = useListExpansionSwitch();

  return (
    <>
      <ListRow>
        <ListCell>
          <WebtoonAvatar webtoon={offer.webtoon}/>
        </ListCell>

        <ListCell>
          {/*todo isExposed*/}
          <Link href={`/creators/${offer.creator.user.id}`} className="clickable">
            {offer.creator.user.name}
          </Link>
        </ListCell>

        <ListCell>
          {offer.buyer.user.name}
        </ListCell>

        <ListCell>
          {switchButton}
        </ListCell>

        <ListCell>
          {offer.offerProposal.decidedAt?.toLocaleDateString(locale)}
        </ListCell>

        <ListCell>
          -
        </ListCell>
      </ListRow>
      <ListRowExpanded>
        <OfferDetailsForInvoice
          offerProposalId={offer.offerProposal.id} />
      </ListRowExpanded>
    </>
  );
}
