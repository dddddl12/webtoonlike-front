"use client";

import Spinner from "@/components/ui/Spinner";
import { Heading2 } from "@/components/ui/common";
import useListData from "@/hooks/listData";
import { listAdmins } from "@/resources/admins/admin.controller";
import { useTranslations } from "next-intl";
import Paginator from "@/components/ui/Paginator";
import DeleteAdmin from "@/app/[locale]/admin/admins/DeleteAdmin";
import AddAdmin from "@/app/[locale]/admin/admins/AddAdmin";
import useReload from "@/hooks/reload";
import { AdminEntryT } from "@/resources/admins/admin.dto";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";

export default function ManageAdminsPage() {
  const { reload, reloadKey } = useReload();

  return (
    <>
      <Heading2 className="flex justify-between">
        <span>관리자 목록</span>
        <AddAdmin reload={reload}/>
      </Heading2>
      <ManageAdminsContent key={reloadKey} reload={reload}/>
    </>
  );
}

function ManageAdminsContent({ reload }: {
  reload: () => void;
}) {
  const { listResponse, filters, setFilters } = useListData(
    listAdmins, {
      page: 1
    });

  if (!listResponse) {
    return <Spinner />;
  }

  return <ListTable columns={[
    {
      label: "이름",
      width: 2
    },
    {
      label: "이메일",
      width: 3
    },
    {
      label: "유저타입",
      width: 2
    },
    {
      label: "관리자타입",
      width: 2
    },
    {
      label: "생성일",
      width: 2
    },
    {
      label: "",
      width: 1
    }
  ]}>
    {listResponse.items
      .map((admin) => <TableRow
        key={admin.id}
        admin={admin}
        reload={reload}
      />)}
    <Paginator
      currentPage={filters.page}
      totalPages={listResponse.totalPages}
      setFilters={setFilters}
    />
  </ListTable>;
}

function TableRow({ admin, reload }:{
  admin: AdminEntryT;
  reload: () => void;
}) {
  const tUserType = useTranslations("userType");
  return (
    <ListRow>
      <ListCell>
        <div className="w-full overflow-ellipsis overflow-hidden">
          {admin.user.name}
        </div>
      </ListCell>
      <ListCell>
        <div className="w-full overflow-ellipsis overflow-hidden">
          {admin.user.email}
        </div>
      </ListCell>
      <ListCell>
        {tUserType(admin.user.userType)}
      </ListCell>
      <ListCell>
        {admin.isSuper ? "수퍼관리자" : "일반관리자"}
      </ListCell>
      <ListCell>
        {admin.createdAt.toLocaleString("ko") ?? "-"}
      </ListCell>
      <ListCell>
        {admin.isDeletable && <DeleteAdmin adminId={admin.id} reload={reload} />}
      </ListCell>
    </ListRow>
  );
}
