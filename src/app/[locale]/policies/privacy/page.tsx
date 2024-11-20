import PrivacyPolicyEn from "@/components/policies/privacy/PrivacyPolicyEn";
import PrivacyPolicyKo from "@/components/policies/privacy/PrivacyPolicyKo";
import { getLocale } from "next-intl/server";
import PageLayout from "@/components/PageLayout";

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  return (
    <PageLayout>
      {locale === "ko" ? <PrivacyPolicyKo /> : <PrivacyPolicyEn />}
    </PageLayout>
  );
}