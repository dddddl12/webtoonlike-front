import { Dispatch, SetStateAction } from "react";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { SignUpStage, UserAccountFormT } from "@/resources/users/dtos/userAccount.dto";
import { useTranslations } from "next-intl";
import { Col, Row } from "@/components/ui/common";
import { IconSignupCreator } from "@/components/svgs/IconSignupCreatori";
import { Button } from "@/shadcn/ui/button";
import { IconSignupBuyer } from "@/components/svgs/IconSignupBuyer";

// todo setUserAccountForm context로 변경
export default function UserTypeSelectorForm({ setUserAccountForm, setSignUpStage }: {
  setUserAccountForm: Dispatch<SetStateAction<Partial<UserAccountFormT>>>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
}) {
  const t = useTranslations("setupPage");

  return <>
    <span className="mb-10">{t("selectMembershipType")}</span>

    <Row className="justify-evenly">
      <RoleColumn
        userType={UserTypeT.Creator}
        setUserAccountForm={setUserAccountForm}
        setSignUpStage={setSignUpStage}
      />

      <div className="border h-full" />

      <RoleColumn
        userType={UserTypeT.Buyer}
        setUserAccountForm={setUserAccountForm}
        setSignUpStage={setSignUpStage}
      />
    </Row>
  </>;
}

function RoleColumn({ userType, setUserAccountForm, setSignUpStage }: {
  userType: UserTypeT;
  setUserAccountForm: Dispatch<SetStateAction<Partial<UserAccountFormT>>>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
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
        setUserAccountForm(prev => ({
          ...prev,
          userType,
        }));
        setSignUpStage(prev => prev + 1);
      }}
      className="w-[160px] bg-black-texts text-white hover:bg-mint"
    >
      {t("createAccount")}
    </Button>
  </Col>;
}