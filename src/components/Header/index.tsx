import { Gap, Row } from "@/shadcn/ui/layouts";
import { NotificationDropdown } from "./NotificationDropdown";
import { TranslationDropdown } from "./TranslationDropdown";
import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import React from "react";
import { NavBar } from "@/components/Header/NavBar";
import { getLocale, getTranslations } from "next-intl/server";
import { Account } from "@/components/Header/Account";
import { SelectItem } from "@/shadcn/ui/select";
import Logo from "@/components/Logo";

export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("localeSwitcher");

  return (
    <header
      className='sticky top-0 w-full flex flex-col bg-black z-[49] border-b border-gray-darker items-center px-10'>
      <Row className="w-full h-[60px] justify-between">
        <Row>
          <Link href="/">
            <Logo/>
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
          <NotificationDropdown />
          <Gap x={3}/>
          <Account />
        </Row>
      </Row>
      <NavBar/>
    </header>
  );
}
