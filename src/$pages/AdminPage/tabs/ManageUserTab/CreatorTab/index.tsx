"use client";

import { Container, Gap, Row } from "@/ui/layouts";
import { useListData } from "@/hooks/ListData";
import * as CreatorApi from "@/apis/creators";
import { useState } from "react";
import { convertTimeAbsolute } from "@/utils/time";
import { Heading } from "@/ui/texts";
import { Pagenator } from "@/ui/tools/Pagenator";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { enqueueSnackbar } from "notistack";
import type { CreatorT, ListCreatorOptionT } from "@backend/types/Creator";


type ToggleButtonProps = {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export function ToggleButton({ defaultChecked, onChange }: ToggleButtonProps): JSX.Element {
  const [isChecked, setIsChecked] = useState(defaultChecked || false);

  const handleToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <div
      className={`flex items-center cursor-pointer w-[60px] ${
        isChecked ? "bg-mint" : "bg-gray"
      } rounded-full p-1 transition-all duration-300`}
      onClick={handleToggle}
    >
      <div
        className={`${
          isChecked ? "translate-x-[25px]" : "translate-x-1"
        } transform bg-white w-6 h-6 rounded-full shadow-md transition-all duration-300`}
      />
    </div>
  );
};

export function ManageCreatorTab() {
  const { data: creators$, actions: CreatorsAct } = useListData({
    listFn: async (listOpt) => {
      return await CreatorApi.list(listOpt);
    },
  });

  const [page, setPage] = useState<number>(0);

  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = creators$.numData || 0;

  const listOpt: ListCreatorOptionT = {
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
    $user: true,
    sort: "recent",
  };

  // TODO
  // useEffect(() => {
  //   if(!me) return;
  //   CreatorsAct.load(listOpt);
  // }, [me, page]);

  const { status, data: creators } = creators$;

  async function handleToggleChange(id: number, isChecked: boolean) {
    try {
      await CreatorApi.update(id, { isExposed: isChecked } );
      enqueueSnackbar("저작권자 노출 여부가 변경되었습니다.", { variant: "success" });
    } catch (e){
      console.log(e);
      enqueueSnackbar("저작권자 노출 여부 변경에 실패했습니다.", { variant: "error" });
    }
  };

  const isLoading = (status: string) => status === "idle" || status === "loading";
  const isError = (status: string) => status === "error";

  if (isLoading(status) ) {
    return <Spinner />;
  }
  if (isError(status)) {
    return <ErrorComponent />;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
    return (
      <div className="flex p-2">
        <div className="w-[25%] p-2 font-bold text-gray-shade">이름</div>
        <div className="w-[25%] p-2 font-bold text-gray-shade flex justify-center">필명</div>
        <div className="w-[25%] p-2 font-bold text-gray-shade flex justify-center">가입일</div>
        <div className="w-[25%] p-2 font-bold text-gray-shade flex justify-center">노출 여부</div>
      </div>
    );
  }

  function TableRow(creator: CreatorT) {
    return (
      <div key={creator.id} className="flex bg-white rounded-sm p-2 my-2">
        <div className="w-[25%] p-2">{creator.user?.fullName}</div>
        <div className="w-[25%] p-2 flex justify-center">{creator.name}</div>
        <div className="w-[25%] p-2 flex justify-center">{creator.createdAt ? convertTimeAbsolute(creator.createdAt) : "-"}</div>
        <div className="w-[25%] p-2 flex justify-center">
          <ToggleButton
            defaultChecked={creator.isExposed}
            onChange={(checkedValue) => { handleToggleChange(creator.id, checkedValue); }}
          />
        </div>
      </div>
    );
  }

  function UserTable(creators: CreatorT[]) {
    return (
      <div className="flex flex-col">
        <TableHeader />
        {creators.map((creator) => <TableRow key={creator.id} {...creator} />)}
      </div>
    );
  }


  return (
    <Container className="p-0">
      <Row className="justify-between">
        <Heading className="font-bold text-[18pt]">저작권자 관리</Heading>
      </Row>
      <Gap y={4} />
      {UserTable(creators)}
      <Pagenator
        page={page}
        numData={totalNumData}
        itemsPerPage={itemPerPage}
        pageWindowLen={pageWindowLen}
        onPageChange={handlePageClick}
      />
      <Gap y={80} />
    </Container>
  );
}
