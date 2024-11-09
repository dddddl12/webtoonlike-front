import { Dispatch, SetStateAction } from "react";
import { SignUpStage, UserExtendedFormT, UserTypeT } from "@/resources/users/user.types";
import { useTranslations } from "next-intl";
import { Col, Row } from "@/shadcn/ui/layouts";
import { IconSignupCreator } from "@/components/svgs/IconSignupCreatori";
import { Button } from "@/shadcn/ui/button";
import { IconSignupBuyer } from "@/components/svgs/IconSignupBuyer";

export default function UserTypeSelector({ setUserExtendedForm, setSignUpStage }: {
  setUserExtendedForm: Dispatch<SetStateAction<Partial<UserExtendedFormT>>>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
}) {
  const t = useTranslations("setupPage");

  return <>
    <span className="text-black mb-10">{t("selectMembershipType")}</span>

    <Row className="justify-evenly">
      <RoleColumn
        userType={UserTypeT.Creator}
        setUserExtendedForm={setUserExtendedForm}
        setSignUpStage={setSignUpStage}
      />

      <div className="border h-full" />

      <RoleColumn
        userType={UserTypeT.Buyer}
        setUserExtendedForm={setUserExtendedForm}
        setSignUpStage={setSignUpStage}
      />
    </Row>
  </>;
}

function RoleColumn({ userType, setUserExtendedForm, setSignUpStage }: {
  userType: UserTypeT;
  setUserExtendedForm: Dispatch<SetStateAction<Partial<UserExtendedFormT>>>;
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
        setUserExtendedForm(prev => ({
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