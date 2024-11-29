import PageLayout from "@/components/ui/PageLayout";
import UpdateAccountWrapper from "@/app/[locale]/account/update/UpdateAccountWrapper";
import { Col } from "@/components/ui/common";
import { Heading1 } from "@/components/ui/common";
import LightThemeProvider from "@/providers/LightThemeProvider";
import Logo from "@/components/ui/Logo";
import { responseHandler } from "@/handlers/responseHandler";
import { getUser } from "@/resources/users/controllers/userAccount.controller";

export default async function UpdateAccount () {
  const user = await getUser()
    .then(responseHandler);
  return (
    <LightThemeProvider>
      <PageLayout lightTheme={true}>
        <Col className="w-[400px] mx-auto">
          <Logo lightTheme={true} />
          <Heading1 className="text-black font-bold text-[20pt] mt-10">
            회원 정보 업데이트
          </Heading1>
          <UpdateAccountWrapper userAccountForm={user} />
        </Col>
      </PageLayout>
    </LightThemeProvider>
  );
}