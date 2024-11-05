"use client";
import CreatorProfileForm from "@/components/Account/CreatorProfileForm";
import BuyerProfileForm from "@/components/Account/BuyerProfileForm";
import BasicUserInfo from "@/components/Account/BasicUserInfo";
import { useRouter } from "@/i18n/routing";
import { useSession } from "@clerk/nextjs";
import { useEffect } from "react";
import { NotSignedInError } from "@/errors";
import { SignUpStatus } from "@/resources/tokens/token.types";

export function SignUpCompleteForm ({ signUpStatus }: {
  signUpStatus: SignUpStatus
}) {
  const router = useRouter();

  // 토큰 재검증
  const { isSignedIn, session } = useSession();
  useEffect(() => {
    // 이미 회원가입을 마친 경우 홈으로 리다이렉트하기 위한 훅
    if (isSignedIn === false) {
      // 로그인하지 않았다면 이 화면으로 넘어올 수 없음
      throw new NotSignedInError();
    }
    if (signUpStatus !== SignUpStatus.Complete || !session){
      // 회원가입을 마치지 않았거나 세션 로딩을 기다리는 중
      return;
    }
    session.touch().then(() => router.replace("/"));
  }, [isSignedIn, session]);

  switch (signUpStatus) {
    case SignUpStatus.NeedsBasicInfo:
      return <BasicUserInfo />;
    case SignUpStatus.NeedsCreatorInfo:
      return <CreatorProfileForm />;
    case SignUpStatus.NeedsBuyerInfo:
      return <BuyerProfileForm />;
    case SignUpStatus.Complete:
      // 잠시 대기했다가 관련 동작 마친 후 리다이렉트 예정
      return null;
    default:
      throw new Error("Unexpected user state");
  }
}