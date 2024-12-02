import { Heading2 } from "@/components/ui/common";
import Accounts from "@/app/[locale]/admin/users/Accounts";
import Creators from "@/app/[locale]/admin/users/Creators";

export default function ManageUserTab() {
  return (
    <>
      <Heading2>회원 관리</Heading2>
      <Accounts />
      <Heading2>저작권자 관리</Heading2>
      <Creators />
    </>
  );
}
