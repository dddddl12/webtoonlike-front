import Spinner from "@/components/ui/Spinner";
import { IssueInvoice } from "./IssueInvoice";
import useListData from "@/hooks/listData";
import Paginator from "@/components/ui/Paginator";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";
import { adminListUninvoicedOffers } from "@/resources/invoices/controllers/invoice.controller";
import { UninvoicedOfferT } from "@/resources/invoices/dtos/invoice.dto";
import { Link } from "@/i18n/routing";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";

export default function UninvoicedOffersList({ reload }: {
  reload: () => void;
}) {
  const { listResponse, filters, setFilters } = useListData(
    adminListUninvoicedOffers, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <NoItems message="현재 협상된 작품이 없습니다."/>;
  }

  return (
    <>
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
          label: "신청일",
          width: 1,
        },
        {
          label: "발행",
          width: 1,
        }
      ]}>
        {listResponse.items.map((offer, i) => (
          <TableRow key={i} offer={offer} reload={reload} />
        ))}
      </ListTable>
      <Paginator
        currentPage={filters.page}
        totalPages={listResponse.totalPages}
        setFilters={setFilters}
      />
    </>
  );
}

function TableRow({ offer, reload }: {
  offer: UninvoicedOfferT;
  reload: () => void;
}) {
  const { offerProposal } = offer;
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
        <p className=" cursor-pointer">{offerProposal.decidedAt?.toLocaleString("ko")}</p>
      </ListCell>
      <ListCell>
        <IssueInvoice offerProposalId={offerProposal.id} reload={reload} />
      </ListCell>
    </ListRow>
  );
}
