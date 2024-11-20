import { SignUpStage } from "@/resources/users/user.types";
import { useTranslations } from "next-intl";
import { Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { Dispatch, SetStateAction } from "react";

export default function AccountFormFooter({ isValid, setSignUpStage, goNextLabel }: {
  isValid: boolean;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
  goNextLabel?: string;
}){
  const tGeneral = useTranslations("general");
  return <Row className="w-full justify-between">
    <Button
      className="w-[49%] bg-black-texts text-white hover:text-black"
      onClick={(e) => {
        e.preventDefault();
        setSignUpStage(prev => prev - 1);
      }}
    >
      {tGeneral("goBack")}
    </Button>
    <Button
      className="w-[49%] bg-black-texts text-white hover:text-black"
      disabled={!isValid}
    >
      {goNextLabel ?? tGeneral("goNext")}
    </Button>
  </Row>;
}
