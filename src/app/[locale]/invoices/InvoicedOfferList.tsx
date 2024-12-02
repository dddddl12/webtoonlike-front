"use client";

import { useLocale, useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import { ListResponse } from "@/resources/globalTypes";
import { listInvoicedOffers } from "@/resources/invoices/controllers/invoice.controller";
import OfferDetailsForInvoice from "@/app/[locale]/invoices/OfferDetailsForInvoice";
import InvoiceDownload from "@/components/shared/InvoiceDownload";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import { InvoicedOfferT } from "@/resources/invoices/dtos/invoice.dto";
import NoItems from "@/components/ui/NoItems";
import { Link } from "@/i18n/routing";
import { ListCell, ListRow, ListTable, useListExpansionSwitch } from "@/components/ui/ListTable";

export function InvoicedOfferList({ initialInvoicedListResponse }: {
  initialInvoicedListResponse: ListResponse<InvoicedOfferT>;
}) {
  const t = useTranslations("invoiceManagement");
  const { listResponse, filters, setFilters } = useListData(
    listInvoicedOffers,
    { page: 1 },
    initialInvoicedListResponse
  );

  if (listResponse.items.length === 0) {
    return <NoItems message={t("noInvoiceIssued")}/>;
  }

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
        label: t("issueDate"),
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


function TableRow({ offer }: { offer: InvoicedOfferT }) {
  const locale = useLocale();
  const { switchButton, ListRowExpanded } = useListExpansionSwitch();

  return (
    <>
      <ListRow>
        <ListCell>
          <WebtoonAvatar webtoon={offer.webtoon}/>
        </ListCell>

        <ListCell>
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
          {offer.invoice.createdAt.toLocaleDateString(locale)}
        </ListCell>

        <ListCell>
          <InvoiceDownload offer={offer}/>
        </ListCell>
      </ListRow>
      <ListRowExpanded>
        <OfferDetailsForInvoice
          offerProposalId={offer.offerProposal.id}/>
      </ListRowExpanded>
    </>
  );
}
