import { Col, Row } from "@/components/ui/common";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Logo from "@/components/ui/Logo";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-footer px-[60px] py-[40px] flex justify-center">
      <Row className="w-[1280px] text-gray-text font-bold">
        <Col className="w-[40%] pb-5">
          <Logo/>
          <p className="mt-4">
            {t("kenazCoLtd")}
          </p>
          <p className="text-lg mt-1">{t("CEOname")}</p>
        </Col>

        <Col className="w-[60%] gap-5 text-sm">
          <Row className="gap-1">
            <Link href="/policies/terms">{t("termsAndConditions")}</Link>
            <span>|</span>
            <Link href="/policies/privacy">{t("privacyPolicy")}</Link>
            <span>|</span>
            <span>{t("customerCenter")} 070-4295-7719</span>
          </Row>

          <Row>{t("description")}</Row>

          <Row className="gap-1">
            <span>
              {t("registrationNumber")} 760-81-00950
            </span>
            <span>|</span>
            <span>
              {t("mailSalesRegistrationNumber")} 2022-제주동홍-70
            </span>
            <span>|</span>
            <span>
              {t("address")} {t("addressLine")}
            </span>
          </Row>
        </Col>
      </Row>
    </footer>
  );
}
