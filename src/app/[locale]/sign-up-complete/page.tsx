import { Col, Gap } from "@/ui/layouts";
import { KenazLogo } from "@/components/svgs/KenazLogo";
import { Heading } from "@/ui/texts";
import { getClerkUser } from "@/utils/auth/server";
import { UserTypeT } from "@/resources/users/user.types";
import { CreatorProfileForm } from "@/components/CreatorProfileForm";
import { BuyerProfileForm } from "@/components/BuyerProfileForm";
import { MeSetupEditor } from "@/app/[locale]/sign-up-complete/MeSetupEditor";
import { getTranslations } from "next-intl/server";
import { ClerkUserMetadataSchema } from "@/utils/auth/base";
import PageLayout from "@/components/PageLayout";

export default async function SignUpComplete() {
  const t = await getTranslations("setupPage");

  return <PageLayout bgColor="light" className="justify-center items-center flex flex-col">
    <Col className="w-[400px]">
      <KenazLogo className="fill-black" />
      <Gap y={10} />
      <Heading className="text-black font-bold text-[20pt]">
        {t("setupAccount")}
      </Heading>
      <SignUpCompleteForm />
    </Col>
  </PageLayout>;
}

async function SignUpCompleteForm () {
  const clerkUser = await getClerkUser();
  const { data: user } = ClerkUserMetadataSchema.safeParse(clerkUser.sessionClaims.metadata);

  switch (user?.type) {
  // case UserTypeT.Creator:
  //   return <CreatorProfileForm />;
    case UserTypeT.Buyer:
      return <BuyerProfileForm />;
    default:
      return <MeSetupEditor />;
  }
}