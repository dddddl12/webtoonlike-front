import { getUser } from "@/resources/users/user.controller";
import PageLayout from "@/components/PageLayout";
import UpdateAccountWrapper from "@/app/[locale]/account/update/UpdateAccountWrapper";
import { Col, Gap } from "@/shadcn/ui/layouts";
import { Heading } from "@/shadcn/ui/texts";
import LightThemeProvider from "@/providers/LightThemeProvider";
import Logo from "@/components/Logo";
import { responseHandler } from "@/handlers/responseHandler";

export default async function UpdateAccount () {
  const user = await getUser()
    .then(responseHandler);
  return (
    <LightThemeProvider>
      <PageLayout lightTheme={true}>
        <Col className="w-[400px] mx-auto">
          <Logo lightTheme={true} />
          <Gap y={10} />
          <Heading className="text-black font-bold text-[20pt]">
            회원 정보 업데이트
          </Heading>
          <UpdateAccountWrapper userExtendedForm={user} />
        </Col>
      </PageLayout>
    </LightThemeProvider>
  );
}