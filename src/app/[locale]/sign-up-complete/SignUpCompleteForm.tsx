"use client";
import CreatorProfileForm from "@/components/forms/account/CreatorProfileForm";
import BuyerProfileForm from "@/components/forms/account/BuyerProfileForm";
import { redirect, useRouter } from "@/i18n/routing";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import UserTypeSelectorForm from "@/components/forms/account/UserTypeSelectorForm";
import UserProfileForm from "@/components/forms/account/UserProfileForm";
import { useToast } from "@/shadcn/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";
import { SignUpStage, UserAccountFormT } from "@/resources/users/dtos/userAccount.dto";

export function SignUpCompleteForm ({ clerkUserFullName, signUpFinished }: {
  signUpFinished: boolean;
  clerkUserFullName: string;
}) {
  const router = useRouter();
  const [signUpStage, setSignUpStage] = useState<SignUpStage>(
    signUpFinished
      ? SignUpStage.Finished
      : SignUpStage.Begin
  );
  const { toast } = useToast();
  const locale = useLocale();
  const tSetupForm = useTranslations("setupForm");

  // 토큰 재검증
  const { isSignedIn, session } = useSession();
  useEffect(() => {
    // 이미 회원가입을 마친 경우 홈으로 리다이렉트하기 위한 훅
    if (isSignedIn === false) {
      // 로그인하지 않았다면 이 화면으로 넘어올 수 없음
      redirect({
        href: "/",
        locale
      });
      return;
    }
    if (signUpStage !== SignUpStage.Finished || !session){
      // 회원가입을 마치지 않았거나 세션 로딩을 기다리는 중
      return;
    }
    session.touch().then(() => router.replace("/"));
  }, [isSignedIn, locale, router, session, signUpStage]);

  // User form과 관련한 회원가입 status 조절
  const [userAccountForm, setUserAccountForm] = useState<Partial<UserAccountFormT>>({
    name: clerkUserFullName,
  });


  if (signUpStage === SignUpStage.Begin) {
    return <UserTypeSelectorForm
      setUserAccountForm={setUserAccountForm}
      setSignUpStage={setSignUpStage}
    />;
  } else if (signUpStage === SignUpStage.FillUserInfo) {
    return <UserProfileForm
      userAccountForm={userAccountForm}
      setUserAccountForm={setUserAccountForm}
      setSignUpStage={setSignUpStage}
    />;
  } else if (signUpStage === SignUpStage.FillRoleInfo) {
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
  } else if (signUpStage === SignUpStage.Finished) {
    // 잠시 대기했다가 관련 동작 마친 후 리다이렉트
    toast({
      description: tSetupForm("completeToast")
    });
    return null;
  }

  throw new Error("Unexpected user state");
}