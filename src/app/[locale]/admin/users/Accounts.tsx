"use client";

import Spinner from "@/components/ui/Spinner";
import Paginator from "@/components/ui/Paginator";
import { Col } from "@/components/ui/common";
import { useTranslations } from "next-intl";
import useListData from "@/hooks/listData";
import { listUsers } from "@/resources/users/controllers/userAdmin.controller";
import { AdminPageAccountT } from "@/resources/users/dtos/userAdmin.dto";
import { ListCell, ListRow, ListTable } from "@/components/ui/ListTable";


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
      <ListTable columns={[
        {
          label: "이름",
          width: 3,
        },
        {
          label: "가입일",
          width: 3,
        },
        {
          label: "유저 종류",
          width: 2,
        }
      ]}>
        {listResponse.items.map((user) => <TableRow key={user.id} user={user} />)}
      </ListTable>
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
    <ListRow>
      <ListCell>
        {user.name}
      </ListCell>
      <ListCell>
        {user.createdAt.toLocaleString("ko")}
      </ListCell>
      <ListCell>
        {t(user.userType)}
      </ListCell>
    </ListRow>
  );
}
