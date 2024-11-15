"use client";

import { AdminPageCreatorT, changeExposed, listCreators } from "@/resources/creators/creator.service";
import { Col, Row } from "@/shadcn/ui/layouts";
import Paginator from "@/components/Paginator";
import { useListData } from "@/hooks/listData";
import Spinner from "@/components/Spinner";
import { useToast } from "@/shadcn/hooks/use-toast";
import { Switch } from "@/shadcn/ui/switch";


export default function Creators() {
  const { listResponse, filters, setFilters } = useListData(
    listCreators, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <Row className="justify-center bg-gray p-4 rounded-sm">
      <p>저작권자 회원이 없습니다.</p>
    </Row>;
  }

  return <>
    <Col>
      <div className="flex p-2">
        <div className="w-[25%] p-2 font-bold text-gray-shade">이름</div>
        <div className="w-[25%] p-2 font-bold text-gray-shade flex justify-center">필명</div>
        <div className="w-[25%] p-2 font-bold text-gray-shade flex justify-center">가입일</div>
        <div className="w-[25%] p-2 font-bold text-gray-shade flex justify-center">노출 여부</div>
      </div>
      {listResponse.items.map((creator) => <TableRow key={creator.id} creator={creator} />)}
    </Col>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}


function TableRow({ creator }:{ creator: AdminPageCreatorT }) {
  const { toast } = useToast();
  return (
    <div key={creator.id} className="flex bg-white rounded-sm p-2 my-2">
      <div className="w-[25%] p-2">{creator.user.name}</div>
      <div className="w-[25%] p-2 flex justify-center">{creator.name}</div>
      <div className="w-[25%] p-2 flex justify-center">{creator.user.createdAt.toLocaleString("ko")}</div>
      <div className="w-[25%] p-2 flex justify-center">
        <Switch
          defaultChecked={creator.isExposed}
          onCheckedChange={async (isExposed) => {
            await changeExposed(creator.id, isExposed);
            toast({
              description: "저작권자 노출 여부가 변경되었습니다."
            });
          }}
        />
      </div>
    </div>
  );
}