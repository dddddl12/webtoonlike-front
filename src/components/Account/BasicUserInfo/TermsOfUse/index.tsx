import { useLocale } from "next-intl";
import TermsOfUseKo from "@/components/Account/BasicUserInfo/TermsOfUse/TermsOfUseKo";
import TermsOfUseEn from "@/components/Account/BasicUserInfo/TermsOfUse/TermsOfUseEn";

export default function TermsOfUse() {
  const locale = useLocale();
  return locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />;
}