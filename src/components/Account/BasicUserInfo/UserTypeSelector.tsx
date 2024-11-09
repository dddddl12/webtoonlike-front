import { Dispatch, SetStateAction } from "react";
import { UserTypeT } from "@/resources/users/user.types";
import { useTranslations } from "next-intl";
import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { IconSignupCreator } from "@/components/svgs/IconSignupCreatori";
import { Button } from "@/shadcn/ui/button";
import { IconSignupBuyer } from "@/components/svgs/IconSignupBuyer";

export default function UserTypeSelector({ setUserType }: {
  setUserType: Dispatch<SetStateAction<UserTypeT | undefined>>;
}) {
  const t = useTranslations("setupPage");

  return <>
    <span className="text-black mb-10">{t("selectMembershipType")}</span>

    <Row className="justify-evenly">
      <Col className="justify-center items-center">
        <IconSignupCreator className="fill-black" />
        <Gap y={4} />
        <span className="text-black">{t("membershipCopyrightHolder")}</span>
        <Gap y={4} />
        <Button
          onClick={() => setUserType(UserTypeT.Creator)}
          className="w-[160px] bg-black-texts text-white hover:bg-mint"
        >
          {t("createAccount")}
        </Button>
      </Col>

      <div className="border border-gray h-[180px]" />

      <Col className="justify-center items-center">
        <IconSignupBuyer className="fill-black" />
        <Gap y={4} />
        <span className="text-black">{t("membershipBuyers")}</span>
        <Gap y={4} />
        <Button
          onClick={() => setUserType(UserTypeT.Buyer)}
          className="w-[160px] bg-black-texts text-white hover:bg-mint"
        >
          {t("createAccount")}
        </Button>
      </Col>
    </Row>
  </>;
}

