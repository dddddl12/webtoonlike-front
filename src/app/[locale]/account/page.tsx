import PageLayout from "@/components/PageLayout";
import AccountBasicInfoSection from "@/app/[locale]/account/AccountBasicInfoSection";
import LikedWebtoonList from "@/app/[locale]/account/LikedWebtoonList";
import { Gap } from "@/shadcn/ui/layouts";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/user.types";

export default async function AccountPage() {
  const { metadata } = await getTokenInfo();

  return (
    <PageLayout>
      <AccountBasicInfoSection/>
      {metadata.type === UserTypeT.Buyer
      && <>
        <Gap y={40}/>
        <LikedWebtoonList />
      </>}
    </PageLayout>
  );
}
