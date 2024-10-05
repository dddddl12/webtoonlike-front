"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useEffect, ReactNode } from "react";
import { useUser$, useUserActions } from "@/states/UserState";
import { Col, Gap } from "@/ui/layouts";
import * as UserApi from "@/apis/users";
import * as AdminApi from "@/apis/admins";
import { MeSetupEditor } from "./MeSetupEditor";
import { CreatorSetupEditor } from "./CreatorSetupEditor";
import { BuyerSetupEditor } from "./BuyerSetupEditor";
import { KenazLogo } from "@/components/svgs/KenazLogo";
import { Heading } from "@/ui/texts";
import { LogoSection } from "@/components/Header/LogoSection";
import { useTranslations, useLocale } from "next-intl";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { ErrorComponent } from "@/components/ErrorComponent";

type MePropviderProps = {
  children: ReactNode;
};

export function MeProvider({ children }: MePropviderProps): ReactNode {
  const auth = useAuth();
  const user$ = useUser$();
  const userAct = useUserActions();
  const locale = useLocale();
  const messages = useMessages();
  const t = useTranslations("setupPage");

  useEffect(() => {
    if (auth.isSignedIn) {
      loadUser();
    } else {
      userAct.reset();
    }
  }, [auth.isSignedIn]);

  async function loadUser() {
    try {
      userAct.patch({ status: "loading" });
      const [{ data: fetchedUser }, { data: fetchedAdmin }] = await Promise.all(
        [UserApi.getMe({ $buyer: true, $creator: true }), AdminApi.getMe()]
      );
      userAct.patch({
        status: "loaded",
        data: { me: fetchedUser, admin: fetchedAdmin },
      });
    } catch (e) {
      console.warn(e);
    }
  }

  function SignUpFrame({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Col>
          <section className="sticky top-0 w-full flex flex-row items-end justify-around bg-black bg-opacity-70 shadow-md z-50">
            <Col className="w-[1280px] items-center">
              <LogoSection />
            </Col>
          </section>
          <Col className="bg-white min-h-[100vh] overflow-y-scroll items-center justify-start">
            <Gap y={40} />
            <Col className="w-[400px]">
              <KenazLogo className="fill-black" />
              <Gap y={10} />
              <Heading className="text-black font-bold text-[20pt]">
                {t("setupAccount")}
              </Heading>
              {children}
            </Col>
          </Col>
        </Col>
      </NextIntlClientProvider>
    );
  }

  if (user$.status == "error") {
    return <ErrorComponent />;
  }

  if (user$.status == "loaded" && user$.data?.me == null) {
    return (
      <SignUpFrame>
        <MeSetupEditor />
      </SignUpFrame>
    );
  }

  if (
    user$.status == "loaded" &&
    user$.data?.me?.userType == "creator" &&
    !user$.data?.me.creator
  ) {
    return (
      <SignUpFrame>
        <CreatorSetupEditor />
      </SignUpFrame>
    );
  }

  if (
    user$.status == "loaded" &&
    user$.data?.me?.userType == "buyer" &&
    !user$.data?.me.buyer
  ) {
    return (
      <SignUpFrame>
        <BuyerSetupEditor />
      </SignUpFrame>
    );
  }

  return children;
}
