import Spinner from "@/components/ui/Spinner";
import { adminListInvoicedOffers } from "@/resources/invoices/controllers/invoice.controller";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import InvoiceDownload from "@/components/shared/InvoiceDownload";
import { InvoicedOfferT } from "@/resources/invoices/dtos/invoice.dto";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";
import { Link } from "@/i18n/routing";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";

export default function InvoicedOffersList() {
  const { listResponse, filters, setFilters } = useListData(
    adminListInvoicedOffers, {
      page: 1,
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <NoItems message="현재까지 발행한 인보이스 기록이 없습니다."/>;
  }
  return <>
    <ListTable columns={[
      {
        label: "작품명",
        width: 1,
      },
      {
        label: "작가명",
        width: 1,
      },
      {
        label: "바이어명",
        width: 1,
      },
      {
        label: "발급일",
        width: 1,
      },
      {
        label: "확인",
        width: 1,
      }
    ]}>
      {listResponse.items.map((offer: InvoicedOfferT, i) => (
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

function TableRow({ offer }: {
  offer: InvoicedOfferT;
}) {
  return (
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
        {offer.invoice.createdAt.toLocaleString("ko")}
      </ListCell>
      <ListCell>
        <InvoiceDownload offer={offer} />
      </ListCell>
    </ListRow>
  );
}