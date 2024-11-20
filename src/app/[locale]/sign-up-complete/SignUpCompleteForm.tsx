"use client";
import CreatorProfileForm from "@/components/Account/CreatorProfileForm";
import BuyerProfileForm from "@/components/Account/BuyerProfileForm";
import { redirect, useRouter } from "@/i18n/routing";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { SignUpStage, UserExtendedFormT, UserTypeT } from "@/resources/users/user.types";
import UserTypeSelector from "@/components/Account/UserTypeSelector";
import UserProfileForm from "@/components/Account/UserProfileForm";
import { useToast } from "@/shadcn/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";

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
  const [userExtendedForm, setUserExtendedForm] = useState<Partial<UserExtendedFormT>>({
    name: clerkUserFullName,
  });


  if (signUpStage === SignUpStage.Begin) {
    return <UserTypeSelector
      setUserExtendedForm={setUserExtendedForm}
      setSignUpStage={setSignUpStage}
    />;
  } else if (signUpStage === SignUpStage.FillUserInfo) {
    return <UserProfileForm
      userExtendedForm={userExtendedForm}
      setUserExtendedForm={setUserExtendedForm}
      setSignUpStage={setSignUpStage}
    />;
  } else if (signUpStage === SignUpStage.FillRoleInfo) {
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
  } else if (signUpStage === SignUpStage.Finished) {
    // 잠시 대기했다가 관련 동작 마친 후 리다이렉트
    toast({
      description: tSetupForm("completeToast")
    });
    return null;
  }

  throw new Error("Unexpected user state");
}