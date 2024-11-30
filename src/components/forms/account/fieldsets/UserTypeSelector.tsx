import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { useTranslations } from "next-intl";
import { Col, Row } from "@/components/ui/common";
import { IconSignupCreator } from "@/components/svgs/IconSignupCreatori";
import { Button } from "@/shadcn/ui/button";
import { IconSignupBuyer } from "@/components/svgs/IconSignupBuyer";

export default function UserTypeSelector({ onSelect }: {
  onSelect: (userType: UserTypeT) => void;
}) {
  const t = useTranslations("setupPage");

  return <>
    <span className="mb-10">{t("selectMembershipType")}</span>

    <Row className="justify-evenly">
      <RoleColumn
        userType={UserTypeT.Creator}
        onSelect={onSelect}
      />

      <div className="border h-full" />

      <RoleColumn
        userType={UserTypeT.Buyer}
        onSelect={onSelect}
      />
    </Row>
  </>;
}

function RoleColumn({ userType, onSelect }: {
  userType: UserTypeT;
  onSelect: (userType: UserTypeT) => void;
}) {
  const t = useTranslations("setupPage");
  const tUserType = useTranslations("userType");
  return <Col className="justify-center items-center gap-4">
    {userType === UserTypeT.Creator
      && <IconSignupBuyer className="fill-black" />}
    {userType === UserTypeT.Buyer
      && <IconSignupCreator className="fill-black" />}

    <span>
      {tUserType(userType)}
    </span>

    <Button
      onClick={() => {
        onSelect(userType);
      }}
      className="w-[160px] bg-black-texts text-white hover:bg-mint"
    >
      {t("createAccount")}
    </Button>
  </Col>;
}