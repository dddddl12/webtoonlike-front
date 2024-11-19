"use client";

import Spinner from "@/components/Spinner";
import { AdminPageAccountT, listUsers } from "@/resources/users/user.service";
import Paginator from "@/components/Paginator";
import { Col } from "@/shadcn/ui/layouts";
import { useTranslations } from "next-intl";
import useListData from "@/hooks/listData";


export default function Accounts() {
  const { listResponse, filters, setFilters } = useListData(
    listUsers, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }
  return (
    <Col>
      <div className="flex flex-col">
        <div className="flex p-2">
          <div className="w-[50%] p-2 font-bold text-gray-shade">이름</div>
          <div className="w-[30%] p-2 font-bold text-gray-shade flex justify-center">가입일</div>
          <div className="w-[20%] p-2 font-bold text-gray-shade flex justify-center">유저 종류</div>
        </div>
        {listResponse.items.map((user) => <TableRow key={user.id} user={user} />)}
      </div>
      <Paginator
        currentPage={filters.page}
        totalPages={listResponse.totalPages}
        setFilters={setFilters}
      />
    </Col>
  );
}


function TableRow({ user }:{
  user: AdminPageAccountT;
}) {
  const t = useTranslations("userType");
  return (
    <div key={user.id} className="flex bg-white rounded-sm p-2 my-2">
      <div className="w-[50%] p-2">{user.name}</div>
      <div className="w-[30%] p-2 flex justify-center">
        {user.createdAt.toLocaleString("ko")}
      </div>
      <div className="w-[20%] p-2 flex justify-center">
        {t(user.userType)}
      </div>
    </div>
  );
}
