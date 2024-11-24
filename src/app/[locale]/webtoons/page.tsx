import { getTokenInfo } from "@/resources/tokens/token.service";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import WebtoonFeed from "@/app/[locale]/webtoons/components/WebtoonFeed";
import ManageWebtoons from "@/app/[locale]/webtoons/components/ManageWebtoons";

export default async function WebtoonsPage() {
  const { metadata } = await getTokenInfo();
  switch (metadata.type) {
    case UserTypeT.Buyer:
      return <WebtoonFeed />;
    case UserTypeT.Creator:
      return <ManageWebtoons />;
    default:
      throw new Error("Invalid user type");
  }
}