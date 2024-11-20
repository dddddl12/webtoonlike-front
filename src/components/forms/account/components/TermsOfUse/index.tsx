import { useLocale } from "next-intl";
import TermsOfUseKo from "@/components/forms/account/components/TermsOfUse/TermsOfUseKo";
import TermsOfUseEn from "@/components/forms/account/components/TermsOfUse/TermsOfUseEn";

export default function TermsOfUse() {
  const locale = useLocale();
  return locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />;
}