import PageLayout from "@/components/ui/PageLayout";
import AccountBasicInfoSection from "@/app/[locale]/account/AccountBasicInfoSection";
import LikedWebtoonList from "@/app/[locale]/account/LikedWebtoonList";
import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/dtos/user.dto";

export default async function AccountPage() {
  const { metadata } = await getTokenInfo();

  return (
    <PageLayout className="space-y-20">
      <AccountBasicInfoSection/>
      {metadata.type === UserTypeT.Buyer
      && <LikedWebtoonList />}
    </PageLayout>
  );
}
