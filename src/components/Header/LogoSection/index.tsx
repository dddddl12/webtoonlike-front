"use client";

import { Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { KenazLogo } from "@/components/svgs/KenazLogo";
import { NotificationDropdown } from "../NotificationDropdown";
import { TranslationDropdown } from "../TranslationDropdown";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SelectItem } from "@/ui/shadcn/Select";
import { routing } from "@/i18n/routing";

export function LogoSection() {
  const router = useRouter();
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();
  const Tinquiry = useTranslations("inquiryMenu");

  return (
    <Row className="w-full h-[60px] justify-between">
      <Row>
        <Gap x={5} />
        <KenazLogo className="fill-white cursor-pointer" onClick={() => {router.push("/");}} />
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
        <Gap x={3} />
        <SignedOut>
          <Text className="bg-white text-black font-bold p-2 rounded-[4px] cursor-pointer" onClick={() => {router.push("/sign-in");}}>
            {Tinquiry("login")}
          </Text>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl={`/${locale}`}/>
        </SignedIn>
      </Row>
    </Row>
  );
}
