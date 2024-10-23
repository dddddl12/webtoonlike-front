import { Col, Gap, Row } from "@/ui/layouts";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { KenazLogo } from "@/components/svgs/KenazLogo";
// import { NotificationDropdown } from "./NotificationDropdown";
import { TranslationDropdown } from "./TranslationDropdown";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SelectItem } from "@/ui/shadcn/Select";
import { routing } from "@/i18n/routing";
import React from "react";
import { NavBar } from "@/components/Header/NavBar";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("localeSwitcher");
  const Tinquiry = useTranslations("inquiryMenu");

  return (
    <header
      className='sticky top-0 w-full flex flex-col bg-black z-50 border-b border-gray-darker items-center px-10'>
      <Row className="w-full h-[60px] justify-between">
        <Row>
          <Link href="/">
            <KenazLogo className="fill-white cursor-pointer" />
          </Link>
        </Row>
        <Row>
          <TranslationDropdown defaultValue={locale}>
            {routing.locales.map((cur) => (
              <SelectItem key={cur} value={cur}>
                {t("locale", { locale: cur })}
              </SelectItem>
            ))}
          </TranslationDropdown>
          {/*<NotificationDropdown />*/}
          <Gap x={3}/>
          <SignedOut>
            <Link className="bg-white text-black font-bold p-2 rounded-[4px] cursor-pointer" href={"/sign-in"}>
              {Tinquiry("login")}
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl={`/${locale}`}/>
          </SignedIn>
        </Row>
      </Row>
      <NavBar/>
    </header>
  );
}
