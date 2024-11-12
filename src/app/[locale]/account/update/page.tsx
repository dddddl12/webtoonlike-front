import { getUser } from "@/resources/users/user.service";
import PageLayout from "@/components/PageLayout";
import UpdateAccountWrapper from "@/app/[locale]/account/update/UpdateAccountWrapper";
import { Col, Gap } from "@/shadcn/ui/layouts";
import { KenazLogo } from "@/components/svgs/KenazLogo";
import { Heading } from "@/shadcn/ui/texts";

export default async function UpdateAccount () {
  const user = await getUser();
  return (
    <PageLayout lightTheme={true}>
      <Col className="w-[400px] mx-auto">
        <KenazLogo className="fill-black" />
        <Gap y={10} />
        <Heading className="text-black font-bold text-[20pt]">
          회원 정보 업데이트
        </Heading>
        <UpdateAccountWrapper userExtendedForm={user} />
      </Col>
    </PageLayout>
  );
}