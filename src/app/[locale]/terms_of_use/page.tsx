"use client";

import TermsOfUseEn from "@/components/Account/TermsOfUse/TermsOfUseEn";
import TermsOfUseKo from "@/components/Account/TermsOfUse/TermsOfUseKo";
import { useLocale } from "next-intl";
import { Col } from "@/shadcn/ui/layouts";

export default function TermsOfUse() {
  const locale = useLocale();
  return (
    <Col className="my-[80px]">
      {locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />}
    </Col>
  );
}
