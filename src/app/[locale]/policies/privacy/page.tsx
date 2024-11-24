import PrivacyPolicyEn from "@/components/shared/policies/privacy/PrivacyPolicyEn";
import PrivacyPolicyKo from "@/components/shared/policies/privacy/PrivacyPolicyKo";
import { getLocale } from "next-intl/server";
import PageLayout from "@/components/ui/PageLayout";

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  return (
    <PageLayout>
      {locale === "ko" ? <PrivacyPolicyKo /> : <PrivacyPolicyEn />}
    </PageLayout>
  );
}