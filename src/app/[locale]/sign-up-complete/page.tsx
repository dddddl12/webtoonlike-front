import { Col, Gap } from "@/shadcn/ui/layouts";
import { Heading } from "@/shadcn/ui/texts";
import { getTranslations } from "next-intl/server";
import PageLayout from "@/components/PageLayout";
import { getClerkUser, updateTokenInfo } from "@/resources/tokens/token.controller";
import { SignUpCompleteForm } from "@/app/[locale]/sign-up-complete/SignUpCompleteForm";
import LightThemeProvider from "@/providers/LightThemeProvider";
import Logo from "@/components/Logo";

export default async function SignUpComplete() {
  const t = await getTranslations("setupPage");
  const { signUpFinished } = await updateTokenInfo();
  const clerkUser = await getClerkUser();

  return <LightThemeProvider>
    <PageLayout lightTheme={true}>
      <Col className="w-[400px] mx-auto">
        <Logo lightTheme={true} />
        <Gap y={10} />
        <Heading className="text-black font-bold text-[20pt]">
          {t("setupAccount")}
        </Heading>
        <SignUpCompleteForm
          signUpFinished={signUpFinished}
          clerkUserFullName={clerkUser.fullName}
        />
      </Col>
    </PageLayout>
  </LightThemeProvider>;
}

