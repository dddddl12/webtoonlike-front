import PageLayout from "@/components/ui/PageLayout";
import { Col } from "@/components/ui/common";
import { responseHandler } from "@/handlers/responseHandler";
import { getUser } from "@/resources/users/controllers/user.controller";
import AccountUpdateForm from "@/components/forms/account/AccountUpdateForm";
import AccountProfile from "@/app/[locale]/account/components/AccountProfile";
import { ClerkLoaded } from "@clerk/nextjs";

export default async function UpdateAccount () {
  const userForm = await getUser()
    .then(responseHandler);
  return (
    <PageLayout>
      <ClerkLoaded>
        <Col className="w-[800px] mx-auto">
          <AccountProfile allowEdit={true} />
          <div className="mt-14">
            <AccountUpdateForm prev={userForm} />
          </div>
        </Col>
      </ClerkLoaded>
    </PageLayout>
  );
}