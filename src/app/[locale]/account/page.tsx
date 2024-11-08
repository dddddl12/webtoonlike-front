import PageLayout from "@/components/PageLayout";
import AccountBasicInfoSection from "@/app/[locale]/account/AccountBasicInfoSection";
import LikedWebtoonList from "@/app/[locale]/account/LikedWebtoonList";
import { Gap } from "@/components/ui/layouts";

export default async function AccountPage() {

  return (
    <PageLayout>
      <AccountBasicInfoSection/>
      <Gap y={40}/>
      <LikedWebtoonList />
    </PageLayout>
  );
}
