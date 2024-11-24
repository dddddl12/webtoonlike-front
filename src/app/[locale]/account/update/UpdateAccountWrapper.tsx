"use client";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { useRouter } from "@/i18n/routing";
import CreatorProfileForm from "@/components/forms/account/CreatorProfileForm";
import BuyerProfileForm from "@/components/forms/account/BuyerProfileForm";
import { useEffect, useState } from "react";
import { useToast } from "@/shadcn/hooks/use-toast";
import { SignUpStage, UserAccountFormT } from "@/resources/users/dtos/userAccount.dto";

export default function UpdateAccountWrapper({ userAccountForm }: {
  userAccountForm: UserAccountFormT;
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

  if (userAccountForm.userType === UserTypeT.Creator) {
    return <CreatorProfileForm
      userAccountForm={userAccountForm}
      setSignUpStage={setSignUpStage}
    />;
  } else if (userAccountForm.userType === UserTypeT.Buyer) {
    return <BuyerProfileForm
      userAccountForm={userAccountForm}
      setSignUpStage={setSignUpStage}
    />;
  }
}