"use client";

import TermsOfUseEn from "@/common/TermsOfUseEn";
import TermsOfUseKo from "@/common/TermsOfUseKo";
import { Container } from "@/ui/layouts";
import { useLocale } from "next-intl";

export default function TermsOfUse() {
  const locale = useLocale();
  return (
    <Container className="my-[80px]">
      {locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />}
    </Container>
  );
}
