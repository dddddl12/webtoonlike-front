"use client";

import Spinner from "@/components/Spinner";
import { Col, Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { useListData } from "@/hooks/listData";
import { AdminEntryT, listAdmins } from "@/resources/admins/admin.service";
import { useTranslations } from "next-intl";
import Paginator from "@/components/Paginator";
import DeleteAdmin from "@/app/[locale]/admin/admins/DeleteAdmin";
import AddAdmin from "@/app/[locale]/admin/admins/AddAdmin";
import { IconDelete } from "@/components/svgs/IconDelete";
import { useCallback, useEffect, useState } from "react";

export default function ManageAdminsPage() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const reloadOnUpdate = useCallback(() => setLoaded(false), []);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    }
  }, [loaded]);

  return (
    <Col className="gap-10">
      <Row className="justify-between">
        <p className="font-bold text-[18pt]">관리자 목록</p>
        <AddAdmin reloadOnUpdate={reloadOnUpdate}/>
      </Row>
      <div className="flex flex-col">
        {loaded
          && <ManageAdminsContent reloadOnUpdate={reloadOnUpdate}/>}
      </div>
    </Col>
  );
}

function ManageAdminsContent({ reloadOnUpdate }: {
  reloadOnUpdate: () => void;
}) {
  const { listResponse, filters, setFilters } = useListData(
    listAdmins, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }

  return <div className="flex flex-col">
    <div className="flex p-2">
      <div className="w-2/12 p-2 font-bold text-gray-shade flex justify-center">이름</div>
      <div className="w-3/12 p-2 font-bold text-gray-shade flex justify-center">이메일</div>
      <div className="w-2/12 p-2 font-bold text-gray-shade flex justify-center">유저타입</div>
      <div className="w-2/12 p-2 font-bold text-gray-shade flex justify-center">관리자타입</div>
      <div className="w-2/12 p-2 font-bold text-gray-shade flex justify-center">생성일</div>
      <div className="w-1/12 p-2 font-bold text-gray-shade flex justify-center"></div>
    </div>

    {listResponse.items
      .map((admin) => <TableRow
        key={admin.id}
        admin={admin}
        reloadOnUpdate={reloadOnUpdate}
      />)}
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </div>;
}

function TableRow({ admin, reloadOnUpdate }:{
  admin: AdminEntryT;
  reloadOnUpdate: () => void;
}) {
  const tUserType = useTranslations("userType");
  return (
    <div key={admin.id} className="flex bg-white rounded-sm p-2 my-2 items-center">
      <div className="w-2/12 p-2 justify-center overflow-ellipsis overflow-hidden">
        {admin.user.name}
      </div>
      <div className="w-3/12 p-2 justify-center overflow-ellipsis overflow-hidden">
        {admin.user.email}
      </div>
      <div className="w-2/12 p-2 flex justify-center">
        {tUserType(admin.user.userType)}
      </div>
      <div className="w-2/12 p-2 flex justify-center">
        {admin.isSuper ? "수퍼관리자" : "일반관리자"}
      </div>
      <div className="w-2/12 p-2 flex justify-center">
        {admin.createdAt.toLocaleString("ko") ?? "-"}
      </div>
      <div className="w-1/12 p-2 flex justify-center">
        {admin.isDeletable && <DeleteAdmin adminId={admin.id} reloadOnUpdate={reloadOnUpdate} />}
      </div>
    </div>
  );
}
