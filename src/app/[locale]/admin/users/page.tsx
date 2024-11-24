import { Col } from "@/components/ui/common";
import Accounts from "@/app/[locale]/admin/users/Accounts";
import Creators from "@/app/[locale]/admin/users/Creators";

export default function ManageUserTab() {
  return (
    <Col className="gap-10">
      <Col>
        <p className="font-bold text-[18pt]">회원 관리</p>
        <Accounts />
      </Col>
      <Col>
        <p className="font-bold text-[18pt]">저작권자 관리</p>
        <Creators />
      </Col>

    </Col>
  );
}
