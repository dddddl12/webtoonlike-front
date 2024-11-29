import { Col } from "@/components/ui/common";
import { Heading1 } from "@/components/ui/common";
import { getTranslations } from "next-intl/server";
import PageLayout from "@/components/ui/PageLayout";
import { getClerkUser } from "@/resources/tokens/token.service";
import LightThemeProvider from "@/providers/LightThemeProvider";
import Logo from "@/components/ui/Logo";
import SignUpCompleteFormSelector from "@/components/root/SignUpComplete/SignUpCompleteFormSelector";

export default async function SignUpComplete() {
  const t = await getTranslations("setupPage");
  const clerkUser = await getClerkUser();

  return <LightThemeProvider>
    <PageLayout lightTheme={true}>
      <Col className="w-[400px] mx-auto">
        <Logo lightTheme={true} />
        <Heading1 className="mt-10 font-bold text-[20pt]">
          {t("setupAccount")}
        </Heading1>
        <SignUpCompleteFormSelector
          clerkUserFullName={clerkUser.fullName}
        />
      </Col>
    </PageLayout>
  </LightThemeProvider>;
}
