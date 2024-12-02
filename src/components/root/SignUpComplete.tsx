import { Heading1 } from "@/components/ui/common";
import { getTranslations } from "next-intl/server";
import PageLayout from "@/components/ui/PageLayout";
import { getClerkUser } from "@/resources/tokens/token.service";
import LightThemeProvider from "@/providers/LightThemeProvider";
import Logo from "@/components/ui/Logo";
import SignUpCompleteForm from "@/components/forms/account/SignUpCompleteForm";

export default async function SignUpComplete() {
  const t = await getTranslations("setupPage");
  const clerkUser = await getClerkUser();

  return <LightThemeProvider>
    <PageLayout>
      <div className="w-[400px] mx-auto">
        <Logo lightTheme={true} />
        <Heading1>
          {t("setupAccount")}
        </Heading1>
        <SignUpCompleteForm
          clerkUserFullName={clerkUser.fullName}
        />
      </div>
    </PageLayout>
  </LightThemeProvider>;
}
