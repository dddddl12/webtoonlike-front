"use client";
import { SignUpStage, UserExtendedFormT, UserTypeT } from "@/resources/users/user.types";
import { useRouter } from "@/i18n/routing";
import CreatorProfileForm from "@/components/Account/CreatorProfileForm";
import BuyerProfileForm from "@/components/Account/BuyerProfileForm";
import { useEffect, useState } from "react";
import { useToast } from "@/shadcn/hooks/use-toast";

export default function UpdateAccountWrapper({ userExtendedForm }: {
  userExtendedForm: UserExtendedFormT;
}) {
  const router = useRouter();
  const [signUpStage, setSignUpStage] = useState<SignUpStage>(
    SignUpStage.FillRoleInfo
  );

  const { toast } = useToast();

  // 토큰 재검증
  useEffect(() => {
    if (signUpStage === SignUpStage.Finished) {
      toast({
        description: "회원 정보가 수정되었습니다."
      });
      router.replace("/account");
    }
    else if (signUpStage !== SignUpStage.FillRoleInfo) {
      router.replace("/account");
    }
  }, [router, signUpStage, toast]);

  if (userExtendedForm.userType === UserTypeT.Creator) {
    return <CreatorProfileForm
      userExtendedForm={userExtendedForm}
      setSignUpStage={setSignUpStage}
    />;
  } else if (userExtendedForm.userType === UserTypeT.Buyer) {
    return <BuyerProfileForm
      userExtendedForm={userExtendedForm}
      setSignUpStage={setSignUpStage}
    />;
  }
}