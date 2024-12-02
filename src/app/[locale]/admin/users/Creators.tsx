"use client";

import { changeExposed, listCreators } from "@/resources/creators/creator.controller";
import Paginator from "@/components/ui/Paginator";
import useListData from "@/hooks/listData";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/shadcn/hooks/use-toast";
import { Switch } from "@/shadcn/ui/switch";
import { useState } from "react";
import useSafeAction from "@/hooks/safeAction";
import NoItems from "@/components/ui/NoItems";
import { AdminPageCreatorT } from "@/resources/creators/creator.dto";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";


export default function Creators() {
  const { listResponse, filters, setFilters } = useListData(
    listCreators, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }
  if (listResponse.items.length === 0) {
    return <NoItems message="저작권자 회원이 없습니다."/>;
  }

  return <>
    <ListTable columns={[
      {
        label: "이름",
        width: 1,
      },
      {
        label: "필명",
        width: 1,
      },
      {
        label: "가입일",
        width: 1,
      },
      {
        label: "노출 여부",
        width: 1,
      }
    ]}>
      {listResponse.items.map((creator) => <TableRow key={creator.id} creator={creator} />)}
    </ListTable>
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </>;
}


function TableRow({ creator }:{ creator: AdminPageCreatorT }) {
  const { toast } = useToast();
  const [isExposed, setIsExposed] = useState(creator.isExposed);
  const [isProcessing, setIsProcessing] = useState(false);
  const { execute } = useSafeAction(changeExposed.bind(null, creator.id), {
    onSettled: () => setIsProcessing(false),
    onSuccess: ({ data }) => {
      if (!data) {
        throw new Error("data is null");
      }
      setIsExposed(data.isExposed);
      toast({
        description: "저작권자 노출 여부가 변경되었습니다."
      });
    }
  });

  return (
    <ListRow>
      <ListCell>
        {creator.user.name}
      </ListCell>
      <ListCell>
        {creator.name}
      </ListCell>
      <ListCell>
        {creator.user.createdAt.toLocaleString("ko")}
      </ListCell>
      <ListCell>
        <Switch
          defaultChecked={creator.isExposed}
          checked={isExposed}
          disabled={isProcessing}
          onCheckedChange={(newIsExposed) => {
            setIsProcessing(true);
            execute({ isExposed: newIsExposed });
          }}
        />
      </ListCell>
    </ListRow>
  );
}
