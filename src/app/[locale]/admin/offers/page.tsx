"use client";

import Spinner from "@/components/ui/Spinner";
import useListData from "@/hooks/listData";
import { Heading2 } from "@/components/ui/common";
import Paginator from "@/components/ui/Paginator";
import { Button } from "@/shadcn/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { adminListOffersByBidRoundId } from "@/resources/offers/controllers/offer.controller";
import { adminListBidRoundsWithOffers } from "@/resources/bidRounds/controllers/bidRoundAdmin.controller";
import { AdminPageBidRoundWithOffersT } from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import WebtoonAvatar from "@/components/ui/WebtoonAvatar";
import NoItems from "@/components/ui/NoItems";
import { OfferWithActiveProposalT } from "@/resources/offers/dtos/offer.dto";
import useSafeAction from "@/hooks/safeAction";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";

// todo 디테일 누락
export default function AdminOffersPage() {
  return (
    <>
      <Heading2>오퍼 관리</Heading2>
      <AdminOffers />
    </>
  );
}

function AdminOffers() {
  const { listResponse, filters, setFilters } = useListData(
    adminListBidRoundsWithOffers, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <NoItems message="현재 오퍼 중 작품이 없습니다."/>;
  }

  return <>
    <ListTable columns={[
      {
        label: "작품명",
        width: 30,
      },
      {
        label: "작가명",
        width: 15,
      },
      {
        label: "제안 오퍼",
        width: 20,
      },
      {
        label: "게시 종료일",
        width: 20,
      },
      {
        label: "",
        width: 15,
      }
    ]}>
      {listResponse.items
        .map((item, i) => <TableRow key={i} bidRound={item} />)}
    </ListTable>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}

function TableRow({ bidRound }:{
  bidRound: AdminPageBidRoundWithOffersT;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <ListRow>
        <ListCell>
          <WebtoonAvatar webtoon={bidRound.webtoon}/>
        </ListCell>
        <ListCell>
          {bidRound.creator.user.name}
        </ListCell>
        <ListCell>
          {`${bidRound.offerCount}개`}
        </ListCell>
        <ListCell>
          {/*TODO negotiation 기준이 맞나? */}
          {bidRound.adminSettings.negoStartsAt?.toLocaleDateString("ko") ?? "-"}
        </ListCell>
        <ListCell>
          <Button onClick={() => setIsExpanded(!isExpanded)}>
            내역 보기
          </Button>
        </ListCell>
      </ListRow>
      {isExpanded && <OfferList bidRoundId={bidRound.id} />}
    </>
  );
}

function OfferList({ bidRoundId }: {
  bidRoundId: number;
}) {
  const [items, setItems] = useState<OfferWithActiveProposalT[]>();
  const boundAdminListOffersByBidRoundId = useMemo(() => adminListOffersByBidRoundId.bind(null, bidRoundId), [bidRoundId]);
  const { execute } = useSafeAction(boundAdminListOffersByBidRoundId, {
    onSuccess: ({ data }) => setItems(data)
  });
  useEffect(() => {
    execute();
  }, [execute]);

  if (!items) {
    return <Spinner />;
  }

  return <ListTable columns={[
    {
      label: "바이어명",
      width: 20,
    },
    {
      label: "오퍼 발송일",
      width: 20,
    },
    {
      label: "현재 상태",
      width: 15,
    },
    {
      label: "희망 판권",
      width: 40,
    },
    {
      label: "",
      width: 15,
    }
  ]}>
    {items
      .map((item) => <OfferItem key={item.id} offer={item} />)}
  </ListTable>;
}

function OfferItem({ offer }: {
  offer: OfferWithActiveProposalT;
}) {
  const { activeOfferProposal } = offer;
  const tBusinessFields = useTranslations("businessFields");
  const tCountries = useTranslations("countries");
  const tOfferProposalStatus = useTranslations("offerProposalStatus");
  return (
    <ListRow>
      <ListCell>
        {offer.buyer.user.name}
      </ListCell>
      <ListCell>
        {offer.createdAt.toLocaleDateString("ko")}
      </ListCell>
      <ListCell>
        {tOfferProposalStatus(activeOfferProposal.status)}
      </ListCell>
      <ListCell>
        {activeOfferProposal.contractRange.map((item) =>
          item.businessField === "WEBTOONS"
            ? `${tBusinessFields(item.businessField)}(${tCountries(item.country)})`
            : `2차(${tBusinessFields(item.businessField)})`
        ).join(", ")}
      </ListCell>
      <ListCell>
        <Button variant="outline">
          협상 보기
        </Button>
      </ListCell>
    </ListRow>
  );
}