"use client";

import { Container, Gap, Row } from "@/ui/layouts";
import { useListData } from "@/hooks/ListData";
import { useState } from "react";
import { convertTimeAbsolute } from "@/utils/time";
import { Heading } from "@/ui/texts";
import { Pagenator } from "@/ui/tools/Pagenator";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";

export function ManageUserTab() {
  const user = getServerUserInfo();

  const { data: userList$, actions: userListAct } = useListData({
    listFn: async (listOpt) => {
      return await UserApi.list(listOpt);
    },
  });

  const [page, setPage] = useState<number>(0);

  const pageWindowLen = 2;
  const itemPerPage = 5;
  const totalNumData = userList$.numData || 0;

  const listOpt: ListUserOptionT = {
    meId: user.id,
    $buyer: true,
    $creator: true,
    $numData: true,
    offset: page * itemPerPage,
    limit: itemPerPage,
  };

  userListAct.load(listOpt);

  const { status, data: userList } = userList$;

  const isLoading = (status: string) => status === "idle" || status === "loading";
  const isError = (status: string) => status === "error";

  if (isLoading(status) ) {
    return <Spinner />;
  }
  if (isError(status)) {
    return <ErrorComponent />;
  }

  function userTypeConverter(userType: string) {
    const userTypeMap: { [key: string]: string } = {
      "creator": "저작권자",
      "buyer": "바이어",
    };
    return userTypeMap[userType] || userType;
  }

  function handlePageClick(page: number) {
    setPage(page);
  }

  function TableHeader() {
    return (
      <div className="flex p-2">
        <div className="w-[60%] p-2 font-bold text-gray-shade">이름</div>
        <div className="w-[20%] p-2 font-bold text-gray-shade flex justify-center">가입일</div>
        <div className="w-[20%] p-2 font-bold text-gray-shade flex justify-center">유저 종류</div>
      </div>
    );
  }

  function TableRow(user: UserT) {
    return (
      <div key={user.id} className="flex bg-white rounded-sm p-2 my-2">
        <div className="w-[60%] p-2">{user.fullName}</div>
        <div className="w-[20%] p-2 flex justify-center">{user.createdAt ? convertTimeAbsolute(user.createdAt) : "-"}</div>
        <div className="w-[20%] p-2 flex justify-center">{userTypeConverter(user.userType)}</div>
      </div>
    );
  }

  function UserTable(userList: UserT[]) {
    return (
      <div className="flex flex-col">
        <TableHeader />
        {userList.map((user) => <TableRow key={user.id} {...user} />)}
      </div>
    );
  }


  return (
    <Container className="p-0">
      <Row className="justify-between">
        <Heading className="font-bold text-[18pt]">회원 관리</Heading>
      </Row>
      <Gap y={4} />
      {UserTable(userList)}
      <Pagenator
        page={page}
        numData={totalNumData}
        itemsPerPage={itemPerPage}
        pageWindowLen={pageWindowLen}
        onPageChange={handlePageClick}
      />
      <Gap y={20} />
      {/*<ManageCreatorTab />*/}
      <Gap y={80} />
    </Container>
  );
}
