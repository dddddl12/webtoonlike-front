import { AdminSheet } from "@/components/AdminSheet";
import { AdminProtector } from "../../AdminProtector";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { useMe } from "@/states/UserState";
import { useListData } from "@/hooks/ListData";
import * as AdminApi from "@/apis/admins";
import { AdminT, ListAdminOptionT } from "@/types";
import { Fragment, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/shadcn/Table";
import { convertTimeAbsolute } from "@/utils/time";
import { Heading, Text } from "@/ui/texts";
import { Button } from "@/ui/shadcn/Button";
import { IconDelete } from "@/components/svgs/IconDelete";
import { useAlertDialog, useConfirmDialog } from "@/hooks/ConfirmDialog";
import axios, { AxiosError } from "axios";
import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";

export function ManageAdmin() {
  const me = useMe();
  const { showAlertDialog } = useAlertDialog();

  const adminListOpt: ListAdminOptionT = {
    meId: me?.id,
    $user: true,
  };

  const { data: adminList$, actions: adminListAct } = useListData({
    listFn: AdminApi.list
  });

  useEffect(() => {
    adminListAct.load(adminListOpt);
  }, []);

  const { status, data: adminList } = adminList$;

  async function handleAddAdmin() {
    try {
      const targetAdmin = prompt("추가할 관리자의 이메일을 입력해 주세요.");

      if (targetAdmin == null) {
        return;
      }
      await AdminApi.createByEmail({ email: targetAdmin });
      await adminListAct.load(adminListOpt);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.data.code === "NOT_EXIST") {
        console.log(e);
        const isOk = await showAlertDialog({
          title: "관리자 추가 실패",
          body: "해당 이메일을 가진 사용자가 존재하지 않습니다.",
          useOk: true,
        });
        if(!isOk) {
          return;
        }
      }
    }
  }

  async function handleDeleteClick(id: number): Promise<void> {
    const isOk = await showAlertDialog({
      title: "관리자 삭제",
      body: "해당 관리자를 삭제 삭제하시겠습니까?",
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await AdminApi.remove(id);
      await adminListAct.load(adminListOpt);
    } catch (e) {
      console.warn(e);
    }
  }

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

  function TableHeader() {
    return (
      <div className="flex p-2">
        <div className="w-2/12 p-2 font-bold text-gray-shade flex justify-start">이름</div>
        <div className="w-[50%] p-2 font-bold text-gray-shade flex justify-start">이메일</div>
        <div className="w-[100px] p-2 font-bold text-gray-shade flex justify-center">유저타입</div>
        <div className="w-[100px] p-2 font-bold text-gray-shade flex justify-center">관리자타입</div>
        <div className="w-[130px] p-2 font-bold text-gray-shade flex justify-center">생성일</div>
        <div className="w-[50px] p-2 font-bold text-gray-shade flex justify-center"></div>
      </div>
    );
  }

  function TableRow(admin: AdminT) {
    return (
      <div key={admin.id} className="flex bg-white rounded-sm p-2 my-2">
        <div className="w-2/12 p-2 flex justify-start">{admin.user.fullName}</div>
        <div className="w-[50%] p-2 flex justify-start">{admin.user.email}</div>
        <div className="w-[100px] p-2 flex justify-center">{userTypeConverter(admin.user.userType)}</div>
        <div className="w-[100px] p-2 flex justify-center">{admin.isSuper ? "수퍼관리자" : "일반관리자"}</div>
        <div className="w-[130px] p-2 flex justify-center">{admin.createdAt ? convertTimeAbsolute(admin.createdAt) : "-"}</div>
        <div className="w-[50px] p-2 flex justify-center">
          <div onClick={() => {handleDeleteClick(admin.id);}} className="bg-red flex flex-row justify-center items-center w-[30px] h-[30px] rounded-sm">
            <IconDelete className="fill-white" />
          </div>
        </div>
      </div>
    );
  }

  function AdminTable(adminList: AdminT[]) {
    return (
      <div className="flex flex-col">
        <TableHeader />
        {adminList.map((admin) => <TableRow key={admin.id} {...admin} />)}
      </div>
    );
  }

  return (
    <Container className="p-0">
      <Row className="justify-between">
        <Heading className="font-bold text-[18pt]">관리자 목록</Heading>
        <Button
          className="bg-mint text-white hover:text-mint"
          onClick={handleAddAdmin}
        >
          관리자 추가
        </Button>
      </Row>
      <Gap y={4} />
      {AdminTable(adminList)}
      <Gap y={80} />
    </Container>
  );
}
