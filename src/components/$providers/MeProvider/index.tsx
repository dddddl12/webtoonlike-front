"use client";

import React, { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Col, Gap } from "@/ui/layouts";
import { MeSetupEditor } from "./MeSetupEditor";
import { CreatorSetupEditor } from "./CreatorSetupEditor";
import { BuyerSetupEditor } from "./BuyerSetupEditor";
import { KenazLogo } from "@/components/svgs/KenazLogo";
import { Heading } from "@/ui/texts";
import { LogoSection } from "@/components/Header/LogoSection";
import { useTranslations, useLocale } from "next-intl";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { AdminT, UserT } from "@/types";

type MeState = {
  user?: UserT;
  admin?: AdminT;
  authenticated: boolean;
};

type MeProviderProps = MeState & {
  children: ReactNode;
};

export const MeContext = createContext<{
  me: MeState;
  setMe: Dispatch<SetStateAction<MeState>>;
}>({
  me: {
    authenticated: false
  },
  setMe: () => {}
});

export function MeProvider({ children, user, admin, authenticated }: MeProviderProps): ReactNode {

  const [me, setMe] = useState<MeState>({
    user, admin, authenticated
  });

  if (authenticated && !user) {
    children = (
      <SignUpFrame>
        <MeSetupEditor />
      </SignUpFrame>
    );
  }

  // TODO 여기까지 완성 후 회원가입 완료할 것
  else if (
    user?.userType === "creator" &&
    !user.creator
  ) {
    children = (
      <SignUpFrame>
        <CreatorSetupEditor />
      </SignUpFrame>
    );
  }

  else if (
    user?.userType === "buyer" &&
    !user.buyer
  ) {
    children = (
      <SignUpFrame>
        <BuyerSetupEditor />
      </SignUpFrame>
    );
  }

  return <MeContext.Provider value={{ me, setMe }}>
    {children}
  </MeContext.Provider>;
}

function SignUpFrame({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const messages = useMessages();
  const t = useTranslations("setupPage");

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

