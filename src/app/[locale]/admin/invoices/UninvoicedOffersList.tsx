import Spinner from "@/components/ui/Spinner";
import { IssueInvoice } from "./IssueInvoice";
import useListData from "@/hooks/listData";
import { Row } from "@/components/ui/common";
import Paginator from "@/components/ui/Paginator";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";
import { adminListUninvoicedOffers } from "@/resources/invoices/controllers/invoice.controller";
import { UninvoicedOfferT } from "@/resources/invoices/dtos/invoice.dto";
import { Link } from "@/i18n/routing";

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
      <div className="flex flex-col">
        <div className="flex p-2">
          <div className="w-[30%] p-2 font-bold text-gray-shade">작품명</div>
          <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">작가명</div>
          <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">바이어명</div>
          <div className="w-[25%] p-2 flex justify-center font-bold text-gray-shade">신청일</div>
          <div className="w-[15%] p-2 flex justify-center font-bold text-gray-shade">인보이스 발행</div>
        </div>
        {listResponse.items.map((offer, i) => (
          <TableRow key={i} offer={offer} reload={reload} />
        ))}
      </div>
      <Paginator
        currentPage={filters.page}
        totalPages={listResponse.totalPages}
        setFilters={setFilters}
      />
    </>
  );
}

function TableRow({ offer,reload }: {
  offer: UninvoicedOfferT;
  reload: () => void;
}) {
  const { offerProposal } = offer;
  return (
    <Row className="flex bg-white rounded-sm p-2 my-2">
      <div className="w-[30%] p-2 flex justify-start">
        <WebtoonAvatar webtoon={offer.webtoon}/>
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        <Link href={`/creators/${offer.creator.user.id}`} className="clickable">
          {offer.creator.user.name}
        </Link>
      </div>
      <div className="w-[15%] p-2 flex justify-center">
        {offer.buyer.user.name}
      </div>
      <div className="w-[25%] p-2 flex justify-center">
        <p className=" cursor-pointer">{offerProposal.decidedAt?.toLocaleString("ko")}</p>
      </div>
      <div className="w-[15%] flex justify-center items-center">
        <IssueInvoice offerProposalId={offerProposal.id} reload={reload} />
      </div>
    </Row>
  );
}
