import { Col, Gap } from "@/shadcn/ui/layouts";
import { KenazLogo } from "@/components/svgs/KenazLogo";
import { Heading } from "@/shadcn/ui/texts";
import { getLocale, getTranslations } from "next-intl/server";
import PageLayout from "@/components/PageLayout";
import { updateTokenInfo } from "@/resources/tokens/token.service";
import { SignUpCompleteForm } from "@/app/[locale]/sign-up-complete/SignUpCompleteForm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "@/i18n/routing";
import LightThemeProvider from "@/providers/LightThemeProvider";

export default async function SignUpComplete() {
  const user = await currentUser();
  if (!user) {
    // 아직 clerk에 로그인하지 않은 경우 홈으로 리다이렉트
    const locale = await getLocale();
    redirect({
      href: "/", locale: locale
    });
    return <></>;
  }

  const t = await getTranslations("setupPage");
  const { signUpFinished } = await updateTokenInfo();
  const clerkUserFullName = [user.firstName, user.lastName]
    .filter((name) => name)
    .join(" ");

  return <LightThemeProvider>
    <PageLayout lightTheme={true}>
      <Col className="w-[400px] mx-auto">
        <KenazLogo className="fill-black" />
        <Gap y={10} />
        <Heading className="text-black font-bold text-[20pt]">
          {t("setupAccount")}
        </Heading>
        <SignUpCompleteForm
          signUpFinished={signUpFinished}
          clerkUserFullName={clerkUserFullName}
        />
      </Col>
    </PageLayout>
  </LightThemeProvider>;
}

