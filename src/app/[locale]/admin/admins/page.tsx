import Spinner from "@/components/Spinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { Col, Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";

export function ManageAdminsPage() {
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
        if (!isOk) {
          return;
        }
      }
    }
  }

  return (
    <Col className="gap-10">
      <Row className="justify-between">
        <p className="font-bold text-[18pt]">장르 관리</p>
        <Button
          variant="mint"
          onClick={handleAddAdmin}
        >
          관리자 추가
        </Button>
      </Row>
      <ManageAdminsContent/>
    </Col>
  );
}


function ManageAdminsContent() {
  return <div className="flex flex-col">
    <div className="flex p-2">
      <div className="w-2/12 p-2 font-bold text-gray-shade flex justify-start">이름</div>
      <div className="w-[50%] p-2 font-bold text-gray-shade flex justify-start">이메일</div>
      <div className="w-[100px] p-2 font-bold text-gray-shade flex justify-center">유저타입</div>
      <div className="w-[100px] p-2 font-bold text-gray-shade flex justify-center">관리자타입</div>
      <div className="w-[130px] p-2 font-bold text-gray-shade flex justify-center">생성일</div>
      <div className="w-[50px] p-2 font-bold text-gray-shade flex justify-center"></div>
    </div>

    {adminList.map((admin) => <TableRow key={admin.id} {...admin} />)}
  </div>;
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
