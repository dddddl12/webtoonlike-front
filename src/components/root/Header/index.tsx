import { Row } from "@/components/ui/common";
import NotificationDropdown from "./NotificationDropdown";
import TranslationDropdown from "./TranslationDropdown";
import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import React from "react";
import NavBar from "@/components/root/Header/NavBar";
import { getLocale, getTranslations } from "next-intl/server";
import Account from "@/components/root/Header/Account";
import { SelectItem } from "@/shadcn/ui/select";
import Logo from "@/components/ui/Logo";

export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("localeSwitcher");

  return (
    <header
      className="sticky top-0 w-full flex flex-col z-[49] border-b border-gray-darker items-center px-10 bg-black text-white">
      <Row className="w-full h-[60px] justify-between">
        <Row>
          <Link href="/">
            <Logo/>
          </Link>
        </Row>
        <Row className="gap-3">
          <TranslationDropdown defaultValue={locale}>
            {routing.locales.map((cur) => (
              <SelectItem key={cur} value={cur}>
                {t("locale", { locale: cur })}
              </SelectItem>
            ))}
          </TranslationDropdown>
          <NotificationDropdown />
          <Account />
        </Row>
      </Row>
      <NavBar/>
    </header>
  );
}
