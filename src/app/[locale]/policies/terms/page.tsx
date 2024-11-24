import TermsOfUseEn from "@/components/shared/policies/terms/TermsOfUseEn";
import TermsOfUseKo from "@/components/shared/policies/terms/TermsOfUseKo";
import { getLocale } from "next-intl/server";
import PageLayout from "@/components/ui/PageLayout";

export default async function TermsPage() {
  const locale = await getLocale();
  return (
    <PageLayout>
      {locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />}
    </PageLayout>
  );
}
