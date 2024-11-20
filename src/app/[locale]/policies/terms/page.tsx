import TermsOfUseEn from "@/components/policies/terms/TermsOfUseEn";
import TermsOfUseKo from "@/components/policies/terms/TermsOfUseKo";
import { getLocale } from "next-intl/server";
import PageLayout from "@/components/PageLayout";

export default async function TermsPage() {
  const locale = await getLocale();
  return (
    <PageLayout>
      {locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />}
    </PageLayout>
  );
}
