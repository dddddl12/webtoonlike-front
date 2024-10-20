import React, { ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RecoilProvider } from "@/components/$providers/RecoilProvider";
import { SnackbarProvider } from "@/hooks/Snackbar";
import { ConfirmDialogShared } from "@/hooks/ConfirmDialog";
import "./globals.css";
import { AOSInit } from "@/ui/AOS";
import { Footer } from "@/components/Footer";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { enUS, koKR } from "@clerk/localizations";
import { Col, Gap } from "@/ui/layouts";
import { LogoSection } from "@/components/LogoSection";
import { NavBar } from "@/components/NavBar";
import { SignUpStatus } from "@backend/types/User";
import { MeSetupEditor } from "@/components/SignUpComplete/MeSetupEditor";
// import { CreatorSetupEditor } from "@/components/SignUpComplete/CreatorSetupEditor";
import { auth, clerkClient } from "@clerk/nextjs/server";
import * as UserApi from "@/apis/users";
import { BuyerProfileForm } from "@/components/BuyerProfileForm";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WebtoonLike",
  description: "웹툰 오퍼 플랫폼 웹툰라이크",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  const currentLocale = useLocale();
  return (
    <ClerkProvider localization={currentLocale === "en" ? enUS : koKR}>
      <RecoilProvider>
        <html lang={locale} className="h-[100%]">
          {/*TODO 필요한지 확인*/}
          <AOSInit />
          <NextIntlClientProvider messages={messages}>
            <body className={`h-[100%] ${inter.className}`}>
              <main className="h-[100%]">
                {/*TODO 필요한지 확인*/}
                <ConfirmDialogShared />
                <SnackbarProvider>
                  <Suspense>
                    <AuthContent>{children}</AuthContent>
                  </Suspense>
                </SnackbarProvider>
              </main>
            </body>
          </NextIntlClientProvider>
        </html>
      </RecoilProvider>
    </ClerkProvider>
  );
}

async function AuthContent({ children }: {
  children: ReactNode;
}) {
  const signUpStatus = await checkSignUpStatus();
  const isSignUpInProgress = !!signUpStatus && signUpStatus !== SignUpStatus.Completed;
  return <>
    <header
      className='sticky top-0 w-full flex flex-row items-end justify-around bg-black shadow-md z-50'>
      <Col className="w-[1280px] items-center">
        <LogoSection/>
        <Gap y="10px"/>
        {!isSignUpInProgress && <NavBar/>}
      </Col>
    </header>
    <div className="h-auto min-h-[100%]">
      {isSignUpInProgress
        ? <SignUpFrame signUpStatus={signUpStatus} />
        : children}
    </div>
    <Footer/>
  </>;
}

function SignUpFrame({ signUpStatus }: {signUpStatus: SignUpStatus}) {
  switch (signUpStatus) {
  case SignUpStatus.BasicUserInfoRequired:
    return <MeSetupEditor />;
  // case SignUpStatus.CreatorDetailsRequired:
  //   return <CreatorSetupEditor />;
  case SignUpStatus.BuyerDetailsRequired:
    return <BuyerProfileForm />;
  default:
    return null;
  }
}

const checkSignUpStatus = async (): Promise<SignUpStatus|void> => {
  const clerkUser = auth();
  if(!clerkUser.userId){
    return;
  }
  const { signUpStatus, clerkUserMetadata } = await UserApi.validateAuth();
  if (clerkUserMetadata) {
    // TODO deep compare로 비교
    await clerkClient.users.updateUserMetadata(clerkUser.userId, {
      publicMetadata: clerkUserMetadata,
    });
  }
  return signUpStatus;
};