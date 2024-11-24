import { useLocale } from "next-intl";
import TermsOfUseKo from "@/components/shared/policies/terms/TermsOfUseKo";
import TermsOfUseEn from "@/components/shared/policies/terms/TermsOfUseEn";

export default function Terms() {
  const locale = useLocale();
  return locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />;
}