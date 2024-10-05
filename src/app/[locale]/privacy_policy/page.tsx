"use client";

import PrivacyPolicyEn from "@/common/PrivacyPolicyEn";
import PrivacyPolicyKo from "@/common/PrivacyPolicyKo";
import { Container } from "@/ui/layouts";
import { useLocale } from "next-intl";

export default function PrivacyPolicy() {
  const locale = useLocale();
  return (
    <Container className="my-[80px]">
      {locale === "ko" ? <PrivacyPolicyKo /> : <PrivacyPolicyEn />}
    </Container>
  );
}