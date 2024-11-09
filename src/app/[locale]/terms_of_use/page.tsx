"use client";

import TermsOfUseEn from "@/components/Account/BasicUserInfo/TermsOfUse/TermsOfUseEn";
import TermsOfUseKo from "@/components/Account/BasicUserInfo/TermsOfUse/TermsOfUseKo";
import { Container } from "@/shadcn/ui/layouts";
import { useLocale } from "next-intl";

export default function TermsOfUse() {
  const locale = useLocale();
  return (
    <Container className="my-[80px]">
      {locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />}
    </Container>
  );
}
