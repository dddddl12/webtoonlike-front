import PrivacyPolicyEn from "@/app/[locale]/privacy_policy/PrivacyPolicyEn";
import PrivacyPolicyKo from "@/app/[locale]/privacy_policy/PrivacyPolicyKo";
import { getLocale } from "next-intl/server";
import PageLayout from "@/components/PageLayout";

export default async function PrivacyPolicy() {
  const locale = await getLocale();
  return (
    <PageLayout>
      {locale === "ko" ? <PrivacyPolicyKo /> : <PrivacyPolicyEn />}
    </PageLayout>
  );
}